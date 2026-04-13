DO $$
BEGIN
  IF to_regclass('public.session') IS NOT NULL THEN
    ALTER TABLE "session"
      ALTER COLUMN "cost_tt" SET DATA TYPE DECIMAL(65,30),
      ALTER COLUMN "cost_ttc" SET DATA TYPE DECIMAL(65,30),
      ALTER COLUMN "win_tt" SET DATA TYPE DECIMAL(65,30),
      ALTER COLUMN "win_ttc" SET DATA TYPE DECIMAL(65,30);
  END IF;
END
$$;

DO $$
BEGIN
  IF to_regclass('public.session_line') IS NOT NULL THEN
    ALTER TABLE "session_line"
      ALTER COLUMN "tt" SET DATA TYPE DECIMAL(65,30),
      ALTER COLUMN "ttc" SET DATA TYPE DECIMAL(65,30);
  END IF;
END
$$;
