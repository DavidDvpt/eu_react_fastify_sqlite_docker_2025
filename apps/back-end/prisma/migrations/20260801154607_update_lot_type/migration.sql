/*
  Warnings:

  - The values [SESSION_LINE,LOT] on the enum `LotType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LotType_new" AS ENUM ('MINING', 'CRAFTING', 'TRADE', 'REFINING');
ALTER TABLE "lot" ALTER COLUMN "lot_type" TYPE "LotType_new" USING ("lot_type"::text::"LotType_new");
ALTER TYPE "LotType" RENAME TO "LotType_old";
ALTER TYPE "LotType_new" RENAME TO "LotType";
DROP TYPE "public"."LotType_old";
COMMIT;
