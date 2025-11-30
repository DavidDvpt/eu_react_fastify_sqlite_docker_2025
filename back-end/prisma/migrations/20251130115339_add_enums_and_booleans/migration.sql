/*
  Warnings:

  - Changed the type of `lot_type` on the `inventory_lots` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `is_active` on the `inventory_lots` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `is_active` on the `item_categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `is_active` on the `item_types` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `is_limited` on the `items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `is_active` on the `items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `is_active` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `is_active` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "LotType" AS ENUM ('SESSION_LINE', 'TRANSACTION', 'LOT');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PURCHASE', 'FOUND', 'GIFT', 'EXISTING_STOCK', 'sell_statusLOST', 'GIVEN');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('SOLDED', 'RETURNED', 'RUNNING');

-- CreateEnum
CREATE TYPE "TransactionLineType" AS ENUM ('GAIN', 'LOST');

-- AlterTable
ALTER TABLE "inventory_lots" DROP COLUMN "lot_type",
ADD COLUMN     "lot_type" "LotType" NOT NULL,
DROP COLUMN "is_active",
ADD COLUMN     "is_active" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "item_categories" DROP COLUMN "is_active",
ADD COLUMN     "is_active" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "item_types" DROP COLUMN "is_active",
ADD COLUMN     "is_active" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "items" DROP COLUMN "is_limited",
ADD COLUMN     "is_limited" BOOLEAN NOT NULL,
DROP COLUMN "is_active",
ADD COLUMN     "is_active" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "is_active",
ADD COLUMN     "is_active" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL,
DROP COLUMN "is_active",
ADD COLUMN     "is_active" BOOLEAN NOT NULL;
