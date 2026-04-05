-- AlterTable
ALTER TABLE "inventory_lot" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "inventory_lot_transaction" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "item" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "item_type" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "item_type" ADD CONSTRAINT "item_type_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lot" ADD CONSTRAINT "inventory_lot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lot_transaction" ADD CONSTRAINT "inventory_lot_transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
