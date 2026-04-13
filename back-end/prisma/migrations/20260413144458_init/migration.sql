/*
  Warnings:

  - Made the column `user_id` on table `item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `item_category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `item_type` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "item" ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "item_category" ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "item_type" ALTER COLUMN "user_id" SET NOT NULL;
