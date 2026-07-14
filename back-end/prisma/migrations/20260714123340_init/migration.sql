/*
  Warnings:

  - You are about to drop the column `cost_tt` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `cost_ttc` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `win_tt` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `win_ttc` on the `transaction` table. All the data in the column will be lost.
  - The `status` column on the `transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "cost_tt",
DROP COLUMN "cost_ttc",
DROP COLUMN "win_tt",
DROP COLUMN "win_ttc",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'RUNNING';
