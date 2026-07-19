/*
  Warnings:

  - You are about to drop the column `createdAt` on the `pedcard` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `pedcard` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `pedcard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transaction_d,type]` on the table `pedcard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_d` to the `pedcard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pedcard" DROP CONSTRAINT "pedcard_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "pedcard" DROP CONSTRAINT "pedcard_userId_fkey";

-- DropIndex
DROP INDEX "pedcard_transactionId_type_key";

-- AlterTable
ALTER TABLE "pedcard" DROP COLUMN "createdAt",
DROP COLUMN "transactionId",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "transaction_id" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pedcard_transaction_d_type_key" ON "pedcard"("transaction_id", "type");

-- AddForeignKey
ALTER TABLE "pedcard" ADD CONSTRAINT "pedcard_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedcard" ADD CONSTRAINT "pedcard_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
