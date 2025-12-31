/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inventory_lot" ALTER COLUMN "is_active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "item" ALTER COLUMN "is_active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "item_category" ALTER COLUMN "is_active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "item_type" ALTER COLUMN "is_active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "firstname" DROP NOT NULL,
ALTER COLUMN "lastname" DROP NOT NULL,
ALTER COLUMN "is_active" SET DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
