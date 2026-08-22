import type { Prisma } from '#prisma/generated/client.js';

export const transactionLineLotItemSelect = {
  lot: { select: { item_id: true } },
} as const;

export const transactionWithLinesInclude = {
  lines: {
    select: {
      quantity: true,
      lot_id: true,
      ...transactionLineLotItemSelect,
    },
  },
} satisfies Prisma.TransactionInclude;

export const transactionEntriesInclude = {
  lines: {
    select: {
      quantity: true,
      lot_id: true,
      ...transactionLineLotItemSelect,
    },
  },
} satisfies Prisma.TransactionInclude;

export type TransactionWithLines = Prisma.TransactionGetPayload<{
  include: typeof transactionWithLinesInclude;
}>;
