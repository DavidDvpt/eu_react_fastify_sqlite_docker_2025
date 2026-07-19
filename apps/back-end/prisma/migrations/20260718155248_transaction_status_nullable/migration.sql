-- AlterTable
ALTER TABLE "transaction" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;
