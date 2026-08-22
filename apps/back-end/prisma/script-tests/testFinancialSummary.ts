import prismaClient from '../prismaClient.js';

const itemId = 'F85D331F-07D0-4C8B-99C0-F1FC003D67B8';

async function main() {
  // const items = await prismaClient.item.findFirst({
  //   where: { id: itemId },
  // });
  //   const transactions = await prismaClient.transaction.findMany({
  //     where: {
  //       lines: {
  //         some: {
  //           lot: {
  //             item_id: itemId,
  //           },
  //         },
  //       },
  //     },
  //     include: {
  //       lines: {
  //         where: {
  //           lot: {
  //             item_id: itemId,
  //           },
  //         },
  //         select: {
  //           lot: {
  //             select: {
  //               item: {
  //                 select: {
  //                   id: true,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  //   const result = transactions.flatMap((transaction) => {
  //     if (transaction.lines.length === 0) {
  //       return [];
  //     }
  //     return transaction.lines.map((line) => ({
  //       itemId: line.lot.item.id,
  //       transactionType: transaction.transaction_type,
  //       status: transaction.status,
  //       tt: Number(transaction.tt),
  //       fee: Number(transaction.fee),
  //       ttc: Number(transaction.ttc),
  //     }));
  //   });
  //   console.log(JSON.stringify(result, null, 2));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prismaClient.$disconnect();
  });
