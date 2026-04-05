-- AlterTable
ALTER TABLE "item_category" ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "item_category" ADD CONSTRAINT "item_category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
