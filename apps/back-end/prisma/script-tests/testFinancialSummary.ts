import type { FinancialSummaryByItem, ItemFinancial } from '@eu/types';
import prismaClient from '../prismaClient.js';

const itemId = 'F85D331F-07D0-4C8B-99C0-F1FC003D67B8';

async function main() {
  // const items = await prismaClient.item.findFirst({
  //   where: { id: itemId },
  // });

  const transactions = await prismaClient.transaction.findMany({
    where: {
      lines: {
        some: {
          lot: {
            item_id: itemId,
          },
        },
      },
    },
    include: {
      lines: {
        where: {
          lot: {
            item_id: itemId,
          },
        },
        select: {
          lot: {
            select: {
              item: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const f = { tt: 0, fee: 0, ttc: 0 };
  const round = (value: number) => Math.round(Number(value) * 100) / 100;
  const createFinancialDefaultValue = (): ItemFinancial => ({
    in: {
      BUY: { ...f },
      FOUND: { ...f },
      GIFT: { ...f },
      EXISTING_STOCK: { ...f },
      GIVEN: { ...f },
      TOTAL: { ...f },
    },
    out: {
      RUNNING: { ...f },
      RETURNED: { ...f, count: 0 },
      CANCELED: { ...f },
      SOLDED: { ...f, count: 0 },
    },
  });

  const result = transactions.reduce<FinancialSummaryByItem>((acc, c) => {
    const tt = Number(c.tt);
    const fee = Number(c.fee);
    const ttc = Number(c.ttc);

    if (c.lines.length === 0) {
      return acc;
    }

    const currentItemId = c.lines[0].lot.item.id;

    if (!acc[currentItemId]) {
      acc[currentItemId] = [createFinancialDefaultValue()];
    }

    const summary = acc[currentItemId][0];

    if (c.transaction_type === 'SELL') {
      if (!c.status) {
        return acc;
      }

      summary.out[c.status].tt = round(summary.out[c.status].tt + tt);
      summary.out[c.status].fee = round(summary.out[c.status].fee + fee);
      summary.out[c.status].ttc = round(summary.out[c.status].ttc + ttc);
      if (c.status === 'SOLDED' || c.status === 'RETURNED') {
        summary.out[c.status].count += 1;
      }
      return acc;
    }

    summary.in[c.transaction_type].tt = round(summary.in[c.transaction_type].tt + tt);
    summary.in[c.transaction_type].fee = round(summary.in[c.transaction_type].fee + fee);
    summary.in[c.transaction_type].ttc = round(summary.in[c.transaction_type].ttc + ttc);

    summary.in.TOTAL.tt = round(summary.in.TOTAL.tt + tt);
    summary.in.TOTAL.fee = round(summary.in.TOTAL.fee + fee);
    summary.in.TOTAL.ttc = round(summary.in.TOTAL.ttc + ttc);

    return acc;
  }, {});

  console.log(JSON.stringify(result, null, 2));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prismaClient.$disconnect();
  });
