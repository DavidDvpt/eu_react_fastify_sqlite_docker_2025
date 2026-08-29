/*
  Warnings:

  - You are about to drop the column `depth` on the `excavator_detail` table. All the data in the column will be lost.
  - You are about to drop the column `efficiency` on the `finder_detail` table. All the data in the column will be lost.
  - You are about to drop the column `ammo_burn` on the `item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "excavator_detail" DROP COLUMN "depth",
ADD COLUMN     "Efficienty" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "finder_detail" DROP COLUMN "efficiency",
ADD COLUMN     "ammo_burn" DECIMAL(65,30),
ADD COLUMN     "depth" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "item" DROP COLUMN "ammo_burn";
