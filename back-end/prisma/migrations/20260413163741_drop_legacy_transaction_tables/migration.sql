/*
  Warnings:

  - You are about to alter the column `cost_tt` on the `session` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.
  - You are about to alter the column `cost_ttc` on the `session` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.
  - You are about to alter the column `win_tt` on the `session` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.
  - You are about to alter the column `win_ttc` on the `session` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.
  - You are about to alter the column `tt` on the `session_line` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.
  - You are about to alter the column `ttc` on the `session_line` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.
  - You are about to drop the `inventory_lot_transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "inventory_lot_transaction" DROP CONSTRAINT "inventory_lot_transaction_inventory_lot_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_lot_transaction" DROP CONSTRAINT "inventory_lot_transaction_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_lot_transaction" DROP CONSTRAINT "inventory_lot_transaction_user_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_item_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_user_id_fkey";

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

-- DropTable
DROP TABLE "inventory_lot_transaction";

-- DropTable
DROP TABLE "transaction";
