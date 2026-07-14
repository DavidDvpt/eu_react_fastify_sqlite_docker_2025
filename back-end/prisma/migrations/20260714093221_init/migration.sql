/*
  Warnings:

  - You are about to drop the column `clics` on the `transaction` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "pedcard_userId_idx";

-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "clics",
ADD COLUMN     "fee" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "tt" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "ttc" DECIMAL(65,30) NOT NULL DEFAULT 0;
