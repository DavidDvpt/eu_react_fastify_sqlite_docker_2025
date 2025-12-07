-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "LotType" AS ENUM ('SESSION_LINE', 'TRANSACTION', 'LOT');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PURCHASE', 'FOUND', 'GIFT', 'EXISTING_STOCK', 'LOST', 'GIVEN');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('SOLDED', 'RETURNED', 'RUNNING');

-- CreateEnum
CREATE TYPE "TransactionLineType" AS ENUM ('GAIN', 'LOST');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "pseudo" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_category" (
    "id" TEXT NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "item_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_type" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "item_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item" (
    "id" TEXT NOT NULL,
    "image_url_id" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "is_limited" BOOLEAN NOT NULL,
    "item_type_id" TEXT NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_lot" (
    "id" TEXT NOT NULL,
    "quantity_remaining" INTEGER NOT NULL,
    "quantity_exported" INTEGER NOT NULL,
    "price_remaining" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "lot_type" "LotType" NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "inventory_lot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "sell_status" "TransactionStatus",
    "quantity" INTEGER NOT NULL,
    "tt_value" DECIMAL(65,30) NOT NULL,
    "ttc_value" DECIMAL(65,30) NOT NULL,
    "fee" DECIMAL(65,30),
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "item_id" TEXT NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_lot_transaction" (
    "inventory_lot_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "inventory_lot_transaction_pkey" PRIMARY KEY ("inventory_lot_id","transaction_id")
);

-- CreateTable
CREATE TABLE "seed_patch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "patch_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seed_patch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_pseudo_key" ON "user"("pseudo");

-- CreateIndex
CREATE UNIQUE INDEX "item_category_name_key" ON "item_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "item_type_name_key" ON "item_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "item_name_key" ON "item"("name");

-- CreateIndex
CREATE UNIQUE INDEX "seed_patch_name_key" ON "seed_patch"("name");

-- AddForeignKey
ALTER TABLE "item_type" ADD CONSTRAINT "item_type_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "item_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_item_type_id_fkey" FOREIGN KEY ("item_type_id") REFERENCES "item_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lot" ADD CONSTRAINT "inventory_lot_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lot_transaction" ADD CONSTRAINT "inventory_lot_transaction_inventory_lot_id_fkey" FOREIGN KEY ("inventory_lot_id") REFERENCES "inventory_lot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lot_transaction" ADD CONSTRAINT "inventory_lot_transaction_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
