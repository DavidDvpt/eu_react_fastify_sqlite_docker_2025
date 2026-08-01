import type { Prisma } from '#prisma/generated/browser.js';
import { LOTS_RAW } from '#prisma/seedDatas/devDatas/lotsRaw.js';
import { TRANSACTION_BUY_RAW } from '#prisma/seedDatas/devDatas/transactionBuyRaw.js';
import {
  TRANSACTION_LOT_BUY_RAW,
  TRANSACTION_LOT_SELL_RAW,
} from '#prisma/seedDatas/devDatas/transactionLot.js';
import { TRANSACTION_SELL_RAW } from '#prisma/seedDatas/devDatas/transactionSellRaw.js';

export const lotSeed = (userId: string): Prisma.LotCreateManyInput[] =>
  LOTS_RAW.map((lot) => ({
    ...lot,
    is_active: lot.quantity_remaining === 0 ? false : true,
    user_id: userId,
  }));

export const transactionBuySeed = (userId: string): Prisma.TransactionCreateManyInput[] =>
  TRANSACTION_BUY_RAW.map((t) => ({
    ...t,
    date_created: '2025-11-23 11:59:01.6897533',
    date_updated: null,
    is_active: true,
    user_id: userId,
  }));

export const transactionSellSeed = (userId: string): Prisma.TransactionCreateManyInput[] =>
  TRANSACTION_SELL_RAW.map((t) => ({
    ...t,
    transaction_type: 'SELL',
    is_active: true,
    user_id: userId,
  }));

export const transactionLotSeed = (): Prisma.TransactionLotCreateManyInput[] =>
  TRANSACTION_LOT_BUY_RAW.concat(TRANSACTION_LOT_SELL_RAW);
