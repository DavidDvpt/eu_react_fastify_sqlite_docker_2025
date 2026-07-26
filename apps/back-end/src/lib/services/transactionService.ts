import type { DatabaseClient } from '#prisma/prismaClient.js';
import type { PrismaMutationResponse, TransactionFormOutputBody } from '@eu/types';

import { LotService } from '#src/lib/services/lotService.js';
import { PedcardService } from '#src/lib/services/pedcardService.js';

export default class TransactionService {
  constructor(private readonly prisma: DatabaseClient) {}

  async buy({
    body,
    userId,
  }: {
    userId: string;
    body: TransactionFormOutputBody;
  }): Promise<PrismaMutationResponse> {
    const result = await this.prisma.$transaction(async (tx) => {
      const ps = new PedcardService(tx);
      const ls = new LotService(tx);

      const fee = body.fee ? body.fee : 0;

      await ps.canPay({ userId, value: fee + body.ttc });

      const transaction = await tx.transaction.create({
        data: {
          transaction_type: body.type,
          status: null,
          user_id: userId,
          tt: body.tt,
          ttc: body.ttc,
          fee,
        },
        select: { id: true },
      });

      await ps.createMany({
        userId,
        transactionId: transaction.id,
        bodys: [
          {
            type: 'BUY_FEE',
            value: -fee,
          },
          {
            type: 'BUY_TTC',
            value: -body.ttc,
          },
        ],
      });

      const lot = await ls.create({
        userId,
        body: {
          quantityRemaining: body.quantity,
          quantityExported: 0,
          priceRemaining: 0,
          itemId: body.itemId,
          lotType: 'TRANSACTION',
          createdAt: new Date().toISOString(),
          isActive: true,
        },
      });

      await tx.transactionLot.create({
        data: {
          transaction_id: transaction.id,
          lot_id: lot.id,
          quantity: body.quantity,
        },
      });

      return {
        id: transaction.id,
      };
    });

    return result;
  }
  async sell({
    body,
    userId,
  }: {
    userId: string;
    body: TransactionFormOutputBody;
  }): Promise<PrismaMutationResponse> {
    const { itemId, quantity } = body;
    const result = await this.prisma.$transaction(async (tx) => {
      const fee = body.fee ?? 0;

      const ls = new LotService(tx);
      const ps = new PedcardService(tx);

      await ps.canPay({ userId, value: fee });

      const transaction = await tx.transaction.create({
        data: {
          transaction_type: body.type,
          status: body.status ?? 'RUNNING',
          user_id: userId,
          tt: body.tt,
          ttc: body.ttc,
          fee,
        },
        select: { id: true },
      });

      await ps.create({
        userId,
        transactionId: transaction.id,
        body: { type: 'SELL_FEE', value: -fee },
      });

      const consumedLots = await ls.consumeQuantityOnLots({ userId, quantity, itemId });

      await Promise.all(
        consumedLots.map((m) =>
          tx.transactionLot.create({
            data: { quantity: m.quantity, lot_id: m.lotId, transaction_id: transaction.id },
          })
        )
      );

      return { id: transaction.id };
    });

    return result;
  }

  // async patchTransaction(userId: string, transactionId: string, body: TransatcionPatchDto) {
  //   void userId;
  //   void body;

  //   // Sell line status updates are handled by TransactionStatusService.
  //   return { transactionId };
  // }})
}
