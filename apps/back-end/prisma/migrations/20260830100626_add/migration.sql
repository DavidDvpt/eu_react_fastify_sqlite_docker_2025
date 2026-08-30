-- CreateTable
CREATE TABLE "nexus_update" (
    "id" TEXT NOT NULL,
    "item_count" INTEGER NOT NULL DEFAULT 0,
    "image_missing_count" INTEGER NOT NULL DEFAULT 0,
    "detail_missing" INTEGER NOT NULL,
    "change_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TEXT NOT NULL,
    "inserted_at" TEXT,
    "updated_at" TEXT,

    CONSTRAINT "nexus_update_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nexus_update_id_key" ON "nexus_update"("id");

-- AddForeignKey
ALTER TABLE "nexus_update" ADD CONSTRAINT "nexus_update_id_fkey" FOREIGN KEY ("id") REFERENCES "item_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
