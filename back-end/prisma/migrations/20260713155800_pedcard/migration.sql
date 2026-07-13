-- CreateEnum
CREATE TYPE "PedCardTupleType" AS ENUM ('INITIAL_BALANCE', 'BUY_TTC', 'BUY_FEE', 'SELL_TTC', 'SELL_FEE', 'ADJUSTMENT');

-- CreateTable
CREATE TABLE "pedcard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionId" TEXT,
    "type" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedcard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pedcard_userId_idx" ON "pedcard"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "pedcard_transactionId_type_key" ON "pedcard"("transactionId", "type");

-- AddForeignKey
ALTER TABLE "pedcard" ADD CONSTRAINT "pedcard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedcard" ADD CONSTRAINT "pedcard_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
