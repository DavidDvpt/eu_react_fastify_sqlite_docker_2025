-- AlterTable
ALTER TABLE "item" ADD COLUMN     "is_stackable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "item_type" ADD COLUMN     "is_stackable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "supports_limited" BOOLEAN NOT NULL DEFAULT false;
