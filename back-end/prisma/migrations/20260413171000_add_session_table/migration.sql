-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('TRADE', 'MINING', 'CRAFTING');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('OPENNED', 'CLOSED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "cost_tt" DECIMAL NOT NULL DEFAULT 0,
    "cost_ttc" DECIMAL NOT NULL DEFAULT 0,
    "win_tt" DECIMAL NOT NULL DEFAULT 0,
    "win_ttc" DECIMAL NOT NULL DEFAULT 0,
    "session_type" "SessionType" NOT NULL,
    "clics" INTEGER NOT NULL DEFAULT 0,
    "status" "SessionStatus" NOT NULL DEFAULT 'OPENNED',
    "user_id" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "session_user_id_idx" ON "session"("user_id");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
