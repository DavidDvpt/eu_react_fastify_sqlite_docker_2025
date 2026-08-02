import type { Prisma } from '#prisma/generated/browser.js';
import { LOTS_RAW } from '#prisma/seedDatas/devDatas/lotsRaw.js';
import { TRANSACTION_BUY_RAW } from '#prisma/seedDatas/devDatas/transactionBuyRaw.js';
import {
  TRANSACTION_LOT_BUY_RAW,
  TRANSACTION_LOT_SELL_RAW,
  TRANSACTION_LOT_SELL_RAW_LATEST_TRUE,
} from '#prisma/seedDatas/devDatas/transactionLotRaw.js';
import {
  TRANSACTION_SELL_RAW,
  TRANSACTION_SELL_RAW_LATEST_TRUE,
} from '#prisma/seedDatas/devDatas/transactionSellRaw.js';
export const lotSeed = (userId: string): Prisma.LotCreateManyInput[] =>
  LOTS_RAW.map((lot) => ({
    ...lot,
    is_active: lot.quantity_remaining === 0 ? false : true,
    user_id: userId,
  }));

export const transactionBuySeed = (userId: string): Prisma.TransactionCreateManyInput[] =>
  TRANSACTION_BUY_RAW.map((t) => ({
    ...t,
    created_at: '2025-11-23T11:59:01.689Z',
    updated_at: null,
    user_id: userId,
  }));

export const transactionSellSeed = (userId: string): Prisma.TransactionCreateManyInput[] =>
  TRANSACTION_SELL_RAW.concat(TRANSACTION_SELL_RAW_LATEST_TRUE).map((t) => ({
    ...t,
    transaction_type: 'SELL',
    user_id: userId,
  }));

export const transactionLotBuySeed = (): Prisma.TransactionLotCreateManyInput[] =>
  TRANSACTION_LOT_BUY_RAW;

export const transactionLotSellSeed = (): Prisma.TransactionLotCreateManyInput[] =>
  TRANSACTION_LOT_SELL_RAW.concat(TRANSACTION_LOT_SELL_RAW_LATEST_TRUE);
