CREATE OR REPLACE FUNCTION sync_archived_sessions_from_solded_line()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.line_type <> 'OUT' OR NEW.sale_status <> 'SOLDED' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.sale_status = 'SOLDED' THEN
    RETURN NEW;
  END IF;

  IF NEW.inventory_lot_id IS NULL THEN
    RETURN NEW;
  END IF;

  WITH touched_lots AS (
    SELECT NEW.inventory_lot_id::text AS lot_id
  ),
  candidate_sessions AS (
    SELECT DISTINCT sl.session_id
    FROM "session_line" sl
    JOIN touched_lots tl
      ON tl.lot_id = sl.inventory_lot_id
  ),
  lot_balance AS (
    SELECT
      l.id AS lot_id,
      COALESCE(SUM(CASE WHEN sl.line_type = 'IN' THEN sl.quantity ELSE 0 END), 0) AS qty_in,
      COALESCE(
        SUM(
          CASE
            WHEN sl.line_type = 'OUT' AND sl.sale_status = 'SOLDED' THEN sl.quantity
            ELSE 0
          END
        ),
        0
      ) AS qty_out
    FROM "lot" l
    LEFT JOIN "session_line" sl
      ON sl.inventory_lot_id = l.id
    GROUP BY l.id
  ),
  session_lot_links AS (
    SELECT DISTINCT
      sl.session_id,
      sl.inventory_lot_id AS lot_id
    FROM "session_line" sl
    WHERE sl.inventory_lot_id IS NOT NULL
      AND sl.session_id IN (SELECT session_id FROM candidate_sessions)
  ),
  session_has_nonzero AS (
    SELECT
      sll.session_id,
      MAX(
        CASE
          WHEN (lb.qty_in - lb.qty_out) <> 0 THEN 1
          ELSE 0
        END
      ) AS has_nonzero_lot
    FROM session_lot_links sll
    JOIN lot_balance lb
      ON lb.lot_id = sll.lot_id
    GROUP BY sll.session_id
  )
  UPDATE "session" s
  SET status = CASE
    WHEN shn.has_nonzero_lot = 0 THEN 'ARCHIVED'::"SessionStatus"
    ELSE 'CLOSED'::"SessionStatus"
  END
  FROM session_has_nonzero shn
  WHERE s.id = shn.session_id;

  UPDATE "session_line" sl
  SET line_status = s.status
  FROM "session" s
  WHERE sl.session_id = s.id
    AND sl.session_id IN (
      SELECT DISTINCT sl2.session_id
      FROM "session_line" sl2
      WHERE sl2.inventory_lot_id = NEW.inventory_lot_id
    );

  RETURN NEW;
END;
$$;

-- @statement-break
DROP TRIGGER IF EXISTS trg_sync_archived_sessions_from_solded_line ON "session_line";

-- @statement-break
CREATE TRIGGER trg_sync_archived_sessions_from_solded_line
AFTER UPDATE OF sale_status ON "session_line"
FOR EACH ROW
WHEN (NEW.line_type = 'OUT' AND NEW.sale_status = 'SOLDED')
EXECUTE FUNCTION sync_archived_sessions_from_solded_line();
