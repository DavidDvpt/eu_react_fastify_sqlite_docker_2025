/*
  Warnings:

  - You are about to drop the column `fee` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `tt` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `ttc` on the `transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "fee",
DROP COLUMN "tt",
DROP COLUMN "ttc",
ADD COLUMN     "clics" INTEGER NOT NULL DEFAULT 0;
