-- AlterTable
ALTER TABLE "inventory_lot" ADD COLUMN "session_line_id" TEXT;

-- CreateIndex
CREATE INDEX "inventory_lot_session_line_id_idx" ON "inventory_lot"("session_line_id");

-- AddForeignKey
ALTER TABLE "inventory_lot"
ADD CONSTRAINT "inventory_lot_session_line_id_fkey"
FOREIGN KEY ("session_line_id") REFERENCES "session_line"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
