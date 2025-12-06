-- CreateTable
CREATE TABLE "seed_patch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "patch_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seed_patch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seed_patch_name_key" ON "seed_patch"("name");
