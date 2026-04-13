-- Move lot linkage from inventory_lot.session_line_id to session_line.inventory_lot_id

-- AlterTable
ALTER TABLE "session_line" ADD COLUMN "inventory_lot_id" TEXT;

-- CreateIndex
CREATE INDEX "session_line_inventory_lot_id_idx" ON "session_line"("inventory_lot_id");

-- AddForeignKey
ALTER TABLE "session_line"
ADD CONSTRAINT "session_line_inventory_lot_id_fkey"
FOREIGN KEY ("inventory_lot_id") REFERENCES "inventory_lot"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- Drop old linkage from inventory_lot to session_line
ALTER TABLE "inventory_lot" DROP CONSTRAINT IF EXISTS "inventory_lot_session_line_id_fkey";
DROP INDEX IF EXISTS "inventory_lot_session_line_id_idx";
ALTER TABLE "inventory_lot" DROP COLUMN IF EXISTS "session_line_id";
