-- CreateEnum
CREATE TYPE "PedCardTupleType" AS ENUM ('INITIAL_BALANCE', 'BUY_TTC', 'BUY_FEE', 'SELL_TTC', 'SELL_FEE', 'ADJUSTMENT');

-- DropIndex
DROP INDEX "pedcard_userId_idx";
