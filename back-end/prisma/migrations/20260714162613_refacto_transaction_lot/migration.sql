/*
  Warnings:

  - The primary key for the `transaction_lot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `transaction_lot` table. All the data in the column will be lost.
  - You are about to drop the column `inventory_lot_id` on the `transaction_lot` table. All the data in the column will be lost.
  - You are about to drop the column `item_id` on the `transaction_lot` table. All the data in the column will be lost.
  - You are about to drop the column `line_status` on the `transaction_lot` table. All the data in the column will be lost.
  - You are about to drop the column `line_type` on the `transaction_lot` table. All the data in the column will be lost.
  - You are about to drop the column `sale_status` on the `transaction_lot` table. All the data in the column will be lost.
  - You are about to drop the column `tt` on the `transaction_lot` table. All the data in the column will be lost.
  - You are about to drop the column `ttc` on the `transaction_lot` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `transaction_lot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transaction_id,lot_id]` on the table `transaction_lot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lot_id` to the `transaction_lot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transaction_lot" DROP CONSTRAINT "transaction_lot_inventory_lot_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction_lot" DROP CONSTRAINT "transaction_lot_item_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction_lot" DROP CONSTRAINT "transaction_lot_user_id_fkey";

-- DropIndex
DROP INDEX "transaction_lot_inventory_lot_id_idx";

-- DropIndex
DROP INDEX "transaction_lot_item_id_idx";

-- DropIndex
DROP INDEX "transaction_lot_transaction_id_idx";

-- DropIndex
DROP INDEX "transaction_lot_user_id_idx";

-- AlterTable
ALTER TABLE "transaction_lot" DROP CONSTRAINT "transaction_lot_pkey",
DROP COLUMN "id",
DROP COLUMN "inventory_lot_id",
DROP COLUMN "item_id",
DROP COLUMN "line_status",
DROP COLUMN "line_type",
DROP COLUMN "sale_status",
DROP COLUMN "tt",
DROP COLUMN "ttc",
DROP COLUMN "user_id",
ADD COLUMN     "lot_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transaction_lot_transaction_id_lot_id_key" ON "transaction_lot"("transaction_id", "lot_id");

-- AddForeignKey
ALTER TABLE "transaction_lot" ADD CONSTRAINT "transaction_lot_lot_id_fkey" FOREIGN KEY ("lot_id") REFERENCES "lot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
