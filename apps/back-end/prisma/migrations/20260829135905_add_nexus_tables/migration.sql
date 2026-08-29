-- AlterTable
ALTER TABLE "item" ADD COLUMN     "ammo_burn" DECIMAL(65,30),
ADD COLUMN     "decay" DECIMAL(65,30),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "is_rare" BOOLEAN,
ADD COLUMN     "is_untradeable" BOOLEAN,
ADD COLUMN     "nexus_id" TEXT,
ADD COLUMN     "weight" DECIMAL(65,30);

-- CreateTable
CREATE TABLE "finder_detail" (
    "id" TEXT NOT NULL,
    "efficiency" DECIMAL(65,30),
    "use_per_minute" DECIMAL(65,30),
    "nexus_url" TEXT,

    CONSTRAINT "finder_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "excavator_detail" (
    "id" TEXT NOT NULL,
    "depth" DECIMAL(65,30),
    "range" DECIMAL(65,30),
    "use_per_minute" DECIMAL(65,30),
    "nexus_url" TEXT,

    CONSTRAINT "excavator_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refiner_detail" (
    "id" TEXT NOT NULL,
    "use_per_minute" DECIMAL(65,30),
    "nexus_url" TEXT,

    CONSTRAINT "refiner_detail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "finder_detail" ADD CONSTRAINT "finder_detail_id_fkey" FOREIGN KEY ("id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "excavator_detail" ADD CONSTRAINT "excavator_detail_id_fkey" FOREIGN KEY ("id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refiner_detail" ADD CONSTRAINT "refiner_detail_id_fkey" FOREIGN KEY ("id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
