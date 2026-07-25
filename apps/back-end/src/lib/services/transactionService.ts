import type {
  PedCardFormOutputBody,
  TransactionFormOutputBody,
  TransatcionPatchDto,
} from '@eu/types';

import { PrismaClient } from '#prisma/generated/client.js';
import prismaClient from '#prisma/prismaClient.js';
import { LotService } from '#src/lib/services/lotService.js';
import { PedcardService } from '#src/lib/services/pedcardService.js';

const PEDCARD_INSUFFICIENT_BALANCE_ERROR = 'PEDCARD_INSUFFICIENT_BALANCE';

class TransactionService {
  private static _client = prismaClient.transaction;
  private static prisma: PrismaClient;

  constructor(private readonly prisma: PrismaClient) {}

  // private static async checkAvaiability(
  //   userId: string,
  //   body: { itemId: string; quantity: number }
  // ) {
  //   const { itemId, quantity } = body;
  //   const availability = await this.repos.lotStock.getAvailableStockByItemId(userId, itemId);

  //   return availability.availableQuantity < quantity ? false : true;
  // }

  static async buy(userId: string, body: TransactionFormOutputBody) {
    await this.prisma.$transaction(async (tx) => {
      const availability = await this.checkAvaiability(userId, body);

      const fee = body.fee ? body.fee : 0;

      const pedCardEntries: PedCardFormOutputBody[] = [];

      if (availability) {
        pedCardEntries.push({
          userId,
          type: 'BUY_FEE',
          value: -fee,
        });

        pedCardEntries.push({
          userId,
          type: 'BUY_TTC',
          value: -body.ttc,
        });
      } else {
        throw new Error('INSUFFISENT AVAILABLE QUANTITY');
      }

      const hasEnoughBalance = await PedcardService.canPay(userId, fee + body.ttc);

      if (!hasEnoughBalance) {
        throw new Error(PEDCARD_INSUFFICIENT_BALANCE_ERROR);
      }

      // Create the transaction, then persist IN lines and inventory lots.
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

      await Promise.all(
        pedCardEntries.map((m) => PedcardService.create({ ...m, transactionId: transaction.id }))
      );

      const lot = await LotService.create(
        userId,
        {
          quantityRemaining: body.quantity,
          quantityExported: 0,
          priceRemaining: 0,
          itemId: body.itemId,
          lotType: 'TRANSACTION',
          createdAt: new Date().toISOString(),
          isActive: true,
        },
        tx
      );

      await tx.transactionLot.create({
        data: {
          transaction_id: transaction.id,
          lot_id: lot.id,
          quantity: body.quantity,
        },
      });

      return {
        transactionId: transaction.id,
      };
    });
  }

  async sell(
    userId: string,
    body: TransactionBodySell
  ): Promise<{
    transactionId: string;
  }> {
    const fee = body.fee ?? 0;
    const availability = await this.checkAvaiability(userId, body);

    if (availability) {
      throw new Error('INSUFFISENT AVAILABLE QUANTITY');
    }

    const hasEnoughBalance = await this.repos.pedCard.hasEnoughBalanceForEntry(userId, fee);

    if (!hasEnoughBalance) {
      throw new Error(PEDCARD_INSUFFICIENT_BALANCE_ERROR);
    }

    // Create sell transaction first; totals are finalized after line processing.
    const transaction = await this.repos.transaction.create({
      data: {
        transaction_type: TransactionType.SELL,
        status: body.status ?? 'RUNNING',
        user_id: userId,
        tt: body.tt,
        ttc: body.ttc,
        fee,
      },
      select: { id: true },
    });

    await this.repos.pedCard.createEntry({
      userId,
      transactionId: transaction.id,
      type: 'SELL_FEE',
      value: -fee,
    });

    return {
      transactionId: transaction.id,
    };
  }

  static async patchTransaction(userId: string, transactionId: string, body: TransatcionPatchDto) {
    void userId;
    void body;

    // Sell line status updates are handled by TransactionStatusService.
    return { transactionId };
  }
}

export { TransactionService };
