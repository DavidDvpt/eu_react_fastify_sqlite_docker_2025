/*
  Warnings:

  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session_line` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session_lot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_fkey";

-- DropForeignKey
ALTER TABLE "session_line" DROP CONSTRAINT "session_line_inventory_lot_id_fkey";

-- DropForeignKey
ALTER TABLE "session_line" DROP CONSTRAINT "session_line_item_id_fkey";

-- DropForeignKey
ALTER TABLE "session_line" DROP CONSTRAINT "session_line_session_id_fkey";

-- DropForeignKey
ALTER TABLE "session_line" DROP CONSTRAINT "session_line_user_id_fkey";

-- DropForeignKey
ALTER TABLE "session_lot" DROP CONSTRAINT "session_lot_inventory_lot_id_fkey";

-- DropForeignKey
ALTER TABLE "session_lot" DROP CONSTRAINT "session_lot_item_id_fkey";

-- DropForeignKey
ALTER TABLE "session_lot" DROP CONSTRAINT "session_lot_session_id_fkey";

-- DropForeignKey
ALTER TABLE "session_lot" DROP CONSTRAINT "session_lot_user_id_fkey";

-- DropTable
DROP TABLE "session";

-- DropTable
DROP TABLE "session_line";

-- DropTable
DROP TABLE "session_lot";
