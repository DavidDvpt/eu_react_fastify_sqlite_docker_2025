-- CreateEnum
CREATE TYPE "SessionLineType" AS ENUM ('IN', 'OUT');

-- CreateTable
CREATE TABLE "session_line" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "line_type" "SessionLineType" NOT NULL,
    "line_status" "SessionStatus" NOT NULL DEFAULT 'OPENNED',
    "sale_status" "TransactionStatus",
    "tt" DECIMAL NOT NULL DEFAULT 0,
    "ttc" DECIMAL NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "session_line_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "session_line_session_id_idx" ON "session_line"("session_id");

-- CreateIndex
CREATE INDEX "session_line_item_id_idx" ON "session_line"("item_id");

-- CreateIndex
CREATE INDEX "session_line_user_id_idx" ON "session_line"("user_id");

-- AddForeignKey
ALTER TABLE "session_line" ADD CONSTRAINT "session_line_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_line" ADD CONSTRAINT "session_line_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_line" ADD CONSTRAINT "session_line_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
