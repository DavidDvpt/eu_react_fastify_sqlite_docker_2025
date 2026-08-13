import type { Prisma } from '#prisma/generated/client.js';

export const lotWithTransactionLotsInclude = {
  transaction_lots: {
    select: {
      quantity: true,
    },
  },
} satisfies Prisma.LotInclude;

export type LotWithLines = Prisma.LotGetPayload<{
  include: typeof lotWithTransactionLotsInclude;
}>;
