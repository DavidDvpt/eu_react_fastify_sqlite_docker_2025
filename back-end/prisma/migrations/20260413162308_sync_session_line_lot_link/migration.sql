/*
  Warnings:

  - You are about to alter the column `cost_tt` on the `session` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.
  - You are about to alter the column `cost_ttc` on the `session` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.
  - You are about to alter the column `win_tt` on the `session` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.
  - You are about to alter the column `win_ttc` on the `session` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.
  - You are about to alter the column `tt` on the `session_line` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.
  - You are about to alter the column `ttc` on the `session_line` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "session" ALTER COLUMN "cost_tt" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "cost_ttc" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "win_tt" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "win_ttc" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "session_line" ALTER COLUMN "tt" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "ttc" SET DATA TYPE DECIMAL(65,30);
