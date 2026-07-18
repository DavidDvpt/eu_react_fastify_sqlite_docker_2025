-- DropIndex
DROP INDEX "transaction_user_id_idx";

-- CreateIndex
CREATE INDEX "transaction_user_id_status_idx" ON "transaction"("user_id", "status");
