import type { Prisma } from '#prisma/generated/client.js';

export const transactionWithLinesInclude = {
  lines: {
    select: {
      quantity: true,
      lot_id: true,
      lot: { select: { item_id: true } },
    },
  },
} satisfies Prisma.TransactionInclude;

export type TransactionWithLines = Prisma.TransactionGetPayload<{
  include: typeof transactionWithLinesInclude;
}>;
