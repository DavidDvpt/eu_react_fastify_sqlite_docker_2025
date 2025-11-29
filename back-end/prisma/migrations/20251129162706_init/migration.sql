-- CreateTable
CREATE TABLE "item_categories" (
    "id" TEXT NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT,
    "is_active" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "item_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "pseudo" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" INTEGER NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT,
    "is_active" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_types" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT,
    "is_active" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "item_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "image_url_id" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "is_limited" INTEGER NOT NULL,
    "item_type_id" TEXT NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT,
    "is_active" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_lots" (
    "id" TEXT NOT NULL,
    "quantity_remaining" INTEGER NOT NULL,
    "quantity_exported" INTEGER NOT NULL,
    "price_remaining" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "lot_type" INTEGER NOT NULL,
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT,
    "is_active" INTEGER NOT NULL,

    CONSTRAINT "inventory_lots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "transaction_type" INTEGER NOT NULL,
    "sell_status" INTEGER,
    "quantity" INTEGER NOT NULL,
    "tt_value" DECIMAL(65,30) NOT NULL,
    "ttc_value" DECIMAL(65,30) NOT NULL,
    "fee" DECIMAL(65,30),
    "date_created" TEXT NOT NULL,
    "date_updated" TEXT,
    "is_active" INTEGER NOT NULL,
    "item_id" TEXT NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_lot_transactions" (
    "inventory_lot_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "inventory_lot_transactions_pkey" PRIMARY KEY ("inventory_lot_id","transaction_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "item_categories_name_key" ON "item_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_pseudo_key" ON "user"("pseudo");

-- CreateIndex
CREATE UNIQUE INDEX "item_types_name_key" ON "item_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "items_name_key" ON "items"("name");

-- AddForeignKey
ALTER TABLE "item_types" ADD CONSTRAINT "item_types_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "item_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_item_type_id_fkey" FOREIGN KEY ("item_type_id") REFERENCES "item_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lots" ADD CONSTRAINT "inventory_lots_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lot_transactions" ADD CONSTRAINT "inventory_lot_transactions_inventory_lot_id_fkey" FOREIGN KEY ("inventory_lot_id") REFERENCES "inventory_lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lot_transactions" ADD CONSTRAINT "inventory_lot_transactions_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
