import { Prisma } from '../../../prisma/generated/client.js';

/**
 * Returns aggregated active inventory by item for one user.
 * Includes item id, available quantity, and total stock value.
 */
const getInventorySql = (userId: string) => Prisma.sql`
  SELECT
    i.id AS item_id,
    COALESCE(SUM(l.quantity_remaining), 0) AS quantity,
    COALESCE(SUM(l.quantity_remaining * i.value), 0) AS total_price
  FROM item i
  JOIN lot l ON l.item_id = i.id AND l.is_active = true
  WHERE l.user_id = ${userId}
    AND l.quantity_remaining > 0
  GROUP BY i.id, i.value
`;

/**
 * Returns aggregated active inventory for one item and one user.
 * Includes item id, available quantity, and total stock value.
 */
const getInventoryByItemIdSql = (userId: string, itemId: string) => Prisma.sql`
  SELECT
    i.id AS item_id,
    COALESCE(SUM(l.quantity_remaining), 0) AS quantity,
    COALESCE(SUM(l.quantity_remaining * i.value), 0) AS total_price
  FROM item i
  JOIN lot l ON l.item_id = i.id AND l.is_active = true
  WHERE l.user_id = ${userId}
    AND i.id = ${itemId}
    AND l.quantity_remaining > 0
  GROUP BY i.id, i.value
`;

/**
 * Returns aggregated active inventory for multiple items and one user.
 * Includes item id, available quantity, and total stock value.
 */
const getInventoryByItemIdsSql = (userId: string, itemIds: string[]) => Prisma.sql`
  SELECT
    i.id AS item_id,
    COALESCE(SUM(l.quantity_remaining), 0) AS quantity,
    COALESCE(SUM(l.quantity_remaining * i.value), 0) AS total_price
  FROM item i
  JOIN lot l ON l.item_id = i.id AND l.is_active = true
  WHERE l.user_id = ${userId}
    AND i.id IN (${Prisma.join(itemIds)})
    AND l.quantity_remaining > 0
  GROUP BY i.id, i.value
`;

/**
 * Returns incoming lots for one item and one user.
 * Each lot is joined with its source IN session line quantity.
 */
const getLotsInByItemIdSql = (userId: string, itemId: string) => Prisma.sql`
  SELECT
    l.id,
    l.lot_type,
    l.quantity_remaining,
    sl_in.quantity AS quantity_initial,
    sl_in.session_status,
    sl_in.line_status,
    l.quantity_exported,
    l.price_remaining,
    l.date_created
  FROM lot l
  JOIN LATERAL (
    SELECT
      sl.quantity,
      sl.line_status,
      s.status AS session_status
    FROM session_line sl
    JOIN session s ON s.id = sl.session_id
    WHERE sl.inventory_lot_id = l.id
      AND sl.user_id = ${userId}
      AND s.user_id = ${userId}
      AND sl.item_id = ${itemId}
      AND sl.line_type = 'IN'
    ORDER BY sl.id ASC
    LIMIT 1
  ) sl_in ON TRUE
  WHERE l.user_id = ${userId}
    AND l.item_id = ${itemId}
    AND l.is_active = true
  ORDER BY l.date_created DESC
`;

/**
 * Returns outgoing session lines (OUT) for one item and one user.
 * Includes quantities and financial totals.
 */
const getLotsOutByItemIdSql = (userId: string, itemId: string) => Prisma.sql`
  SELECT
    sl.id,
    l.date_created,
    sl.quantity,
    sl.line_status,
    s.status AS session_status,
    sl.tt,
    sl.ttc,
    sl.sale_status
  FROM session_line sl
  JOIN session s ON s.id = sl.session_id
  LEFT JOIN lot l ON l.id = sl.inventory_lot_id
  WHERE sl.user_id = ${userId}
    AND s.user_id = ${userId}
    AND sl.item_id = ${itemId}
    AND sl.line_type = 'OUT'
  ORDER BY sl.id DESC
`;

/**
 * Returns sellable lots for one item and one user ordered by FIFO.
 * Only active lots with remaining quantity > 0 are returned.
 */
const getSellableLotsFifoByItemIdSql = (userId: string, itemId: string) => Prisma.sql`
  SELECT
    l.id,
    l.item_id,
    l.quantity_remaining,
    l.quantity_exported,
    l.price_remaining,
    l.date_created
  FROM lot l
  WHERE l.user_id = ${userId}
    AND l.item_id = ${itemId}
    AND l.is_active = true
    AND l.quantity_remaining > 0
  ORDER BY l.date_created ASC, l.id ASC
`;

/**
 * Returns a single sellable lot by id for one user.
 * The lot must be active and have remaining quantity > 0.
 */
const getSellableLotByIdSql = (userId: string, lotId: string) => Prisma.sql`
  SELECT
    l.id,
    l.item_id,
    l.quantity_remaining,
    l.quantity_exported,
    l.price_remaining,
    l.date_created
  FROM lot l
  WHERE l.user_id = ${userId}
    AND l.id = ${lotId}
    AND l.is_active = true
    AND l.quantity_remaining > 0
  LIMIT 1
`;

export {
  getSellableLotsFifoByItemIdSql,
  getLotsInByItemIdSql,
  getLotsOutByItemIdSql,
  getSellableLotByIdSql,
  getInventoryByItemIdSql,
  getInventoryByItemIdsSql,
  getInventorySql,
};
