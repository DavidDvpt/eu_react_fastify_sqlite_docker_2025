/*
  Warnings:

  - The values [sell_statusLOST] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.
  - The `sell_status` column on the `transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `transaction_type` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('PURCHASE', 'FOUND', 'GIFT', 'EXISTING_STOCK', 'LOST', 'GIVEN');
ALTER TABLE "transactions" ALTER COLUMN "transaction_type" TYPE "TransactionType_new" USING ("transaction_type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "public"."TransactionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "transaction_type",
ADD COLUMN     "transaction_type" "TransactionType" NOT NULL,
DROP COLUMN "sell_status",
ADD COLUMN     "sell_status" "TransactionStatus";
