/*
  Warnings:

  - You are about to drop the column `item_type_id` on the `item` table. All the data in the column will be lost.
  - Added the required column `type_id` to the `item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_item_type_id_fkey";

-- AlterTable
ALTER TABLE "item" DROP COLUMN "item_type_id",
ADD COLUMN     "type_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "item_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
