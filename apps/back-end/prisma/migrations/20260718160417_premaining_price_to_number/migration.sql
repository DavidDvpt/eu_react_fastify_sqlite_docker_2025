/*
  Warnings:

  - The `price_remaining` column on the `lot` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "lot" DROP COLUMN "price_remaining",
ADD COLUMN     "price_remaining" DOUBLE PRECISION DEFAULT 0;
