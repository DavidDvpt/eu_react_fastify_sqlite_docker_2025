-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "LotType" AS ENUM ('SESSION_LINE', 'TRANSACTION', 'LOT');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PURCHASE', 'FOUND', 'GIFT', 'EXISTING_STOCK', 'SELL', 'GIVEN');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('SOLDED', 'RETURNED', 'RUNNING');

-- CreateEnum
CREATE TYPE "TransactionLineType" AS ENUM ('GAIN', 'LOST');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('TRANSACTION', 'MINING', 'CRAFTING');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('OPENNED', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SessionLineType" AS ENUM ('IN', 'OUT');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "pseudo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "cost_tt" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "cost_ttc" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "win_tt" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "win_ttc" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "session_type" "SessionType" NOT NULL,
    "clics" INTEGER NOT NULL DEFAULT 0,
    "status" "SessionStatus" NOT NULL DEFAULT 'OPENNED',
    "user_id" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_line" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "inventory_lot_id" TEXT,
    "quantity" INTEGER NOT NULL,
    "line_type" "SessionLineType" NOT NULL,
    "line_status" "SessionStatus" NOT NULL DEFAULT 'OPENNED',
    "sale_status" "TransactionStatus",
    "tt" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ttc" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "session_line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_lot" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "inventory_lot_id" TEXT,
    "quantity" INTEGER NOT NULL,
    "line_type" "SessionLineType" NOT NULL,
    "line_status" "SessionStatus" NOT NULL DEFAULT 'OPENNED',
    "sale_status" "TransactionStatus",
    "tt" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ttc" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "session_lot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "cost_tt" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "cost_ttc" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "win_tt" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "win_ttc" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "transaction_type" "TransactionType" NOT NULL,
    "clics" INTEGER NOT NULL DEFAULT 0,
    "status" "SessionStatus" NOT NULL DEFAULT 'OPENNED',
    "user_id" TEXT NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_lot" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "inventory_lot_id" TEXT,
    "quantity" INTEGER NOT NULL,
    "line_type" "SessionLineType" NOT NULL,
    "line_status" "SessionStatus" NOT NULL DEFAULT 'OPENNED',
    "sale_status" "TransactionStatus",
    "tt" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ttc" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "transaction_lot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_category" (
    "id" TEXT NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "item_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_type" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_stackable" BOOLEAN NOT NULL DEFAULT false,
    "supports_limited" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
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
    "user_id" TEXT NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_stackable" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lot" (
    "id" TEXT NOT NULL,
    "quantity_remaining" INTEGER NOT NULL,
    "quantity_exported" INTEGER NOT NULL,
    "price_remaining" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "lot_type" "LotType" NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT,

    CONSTRAINT "lot_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_user_id_idx" ON "session"("user_id");

-- CreateIndex
CREATE INDEX "session_line_session_id_idx" ON "session_line"("session_id");

-- CreateIndex
CREATE INDEX "session_line_item_id_idx" ON "session_line"("item_id");

-- CreateIndex
CREATE INDEX "session_line_inventory_lot_id_idx" ON "session_line"("inventory_lot_id");

-- CreateIndex
CREATE INDEX "session_line_user_id_idx" ON "session_line"("user_id");

-- CreateIndex
CREATE INDEX "session_lot_session_id_idx" ON "session_lot"("session_id");

-- CreateIndex
CREATE INDEX "session_lot_item_id_idx" ON "session_lot"("item_id");

-- CreateIndex
CREATE INDEX "session_lot_inventory_lot_id_idx" ON "session_lot"("inventory_lot_id");

-- CreateIndex
CREATE INDEX "session_lot_user_id_idx" ON "session_lot"("user_id");

-- CreateIndex
CREATE INDEX "transaction_user_id_idx" ON "transaction"("user_id");

-- CreateIndex
CREATE INDEX "transaction_lot_transaction_id_idx" ON "transaction_lot"("transaction_id");

-- CreateIndex
CREATE INDEX "transaction_lot_item_id_idx" ON "transaction_lot"("item_id");

-- CreateIndex
CREATE INDEX "transaction_lot_inventory_lot_id_idx" ON "transaction_lot"("inventory_lot_id");

-- CreateIndex
CREATE INDEX "transaction_lot_user_id_idx" ON "transaction_lot"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "item_category_name_key" ON "item_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "item_type_name_key" ON "item_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "item_name_key" ON "item"("name");

-- CreateIndex
CREATE UNIQUE INDEX "seed_patch_name_key" ON "seed_patch"("name");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_line" ADD CONSTRAINT "session_line_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_line" ADD CONSTRAINT "session_line_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_line" ADD CONSTRAINT "session_line_inventory_lot_id_fkey" FOREIGN KEY ("inventory_lot_id") REFERENCES "lot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_line" ADD CONSTRAINT "session_line_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_lot" ADD CONSTRAINT "session_lot_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_lot" ADD CONSTRAINT "session_lot_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_lot" ADD CONSTRAINT "session_lot_inventory_lot_id_fkey" FOREIGN KEY ("inventory_lot_id") REFERENCES "lot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_lot" ADD CONSTRAINT "session_lot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_lot" ADD CONSTRAINT "transaction_lot_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_lot" ADD CONSTRAINT "transaction_lot_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_lot" ADD CONSTRAINT "transaction_lot_inventory_lot_id_fkey" FOREIGN KEY ("inventory_lot_id") REFERENCES "lot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_lot" ADD CONSTRAINT "transaction_lot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_category" ADD CONSTRAINT "item_category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_type" ADD CONSTRAINT "item_type_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "item_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_type" ADD CONSTRAINT "item_type_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_item_type_id_fkey" FOREIGN KEY ("item_type_id") REFERENCES "item_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lot" ADD CONSTRAINT "lot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lot" ADD CONSTRAINT "lot_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
