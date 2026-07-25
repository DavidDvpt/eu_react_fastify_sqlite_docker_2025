import { TransactionType } from '../../../prisma/generated/client.js';

import type { PrismaClient } from '../../../prisma/generated/client.js';
import type {
  TransactionBodyBuy,
  TransactionBodySell,
} from '../../modules/transaction/transactionTypes.js';
import type { AppRepos } from '../../types/fastify.js';
import type { PedCardEntryInput } from '../repositories/pedCardRepository.js';
import type { TransatcionPatchDto } from '@eu/types';

const PEDCARD_INSUFFICIENT_BALANCE_ERROR = 'PEDCARD_INSUFFICIENT_BALANCE';

class TransactionService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly repos: AppRepos
  ) {}

  private async checkAvaiability(userId: string, body: { itemId: string; quantity: number }) {
    const { itemId, quantity } = body;
    const availability = await this.repos.lotStock.getAvailableStockByItemId(userId, itemId);

    return availability.availableQuantity < quantity ? false : true;
  }

  async buy(
    userId: string,
    body: TransactionBodyBuy
  ): Promise<{
    transactionId: string;
  }> {
    return this.prisma.$transaction(async (tx) => {
      const availability = await this.checkAvaiability(userId, body);

      const pedCardEntries: PedCardEntryInput[] = [];

      if (availability) {
        pedCardEntries.push({
          userId,
          transactionId: null,
          type: 'BUY_FEE',
          value: -body.fee,
        });

        pedCardEntries.push({
          userId,
          transactionId: null,
          type: 'BUY_TTC',
          value: -body.ttc,
        });
      } else {
        throw new Error('INSUFFISENT AVAILABLE QUANTITY');
      }

      const hasEnoughBalance = await this.repos.pedCard.hasEnoughBalanceForEntry(
        userId,
        body.fee + body.ttc
      );

      if (!hasEnoughBalance) {
        throw new Error(PEDCARD_INSUFFICIENT_BALANCE_ERROR);
      }

      // Create the transaction, then persist IN lines and inventory lots.
      const transaction = await this.repos.transaction.create({
        data: {
          transaction_type: TransactionType.PURCHASE,
          status: null,
          user_id: userId,
          tt: body.tt,
          ttc: body.ttc,
          fee: body.fee ?? 0,
        },
        select: { id: true },
      });

      await this.repos.pedCard.createManyEntries(
        pedCardEntries.map((entry) => ({
          ...entry,
          transactionId: transaction.id,
        }))
      );

      const lot = await this.repos.lot.create({
        data: {
          quantity_remaining: body.quantity,
          quantity_exported: 0,
          price_remaining: 0,
          item_id: body.itemId,
          lot_type: 'TRANSACTION',
          date_created: new Date().toISOString(),
          user_id: userId,
        },
        select: { id: true },
      });

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
    const availability = await this.checkAvaiability(userId, body);

    if (availability) {
      throw new Error('INSUFFISENT AVAILABLE QUANTITY');
    }

    const hasEnoughBalance = await this.repos.pedCard.hasEnoughBalanceForEntry(userId, body.fee);

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
        fee: body.fee,
      },
      select: { id: true },
    });

    await this.repos.pedCard.createEntry({
      userId,
      transactionId: transaction.id,
      type: 'SELL_FEE',
      value: -body.fee,
    });

    return {
      transactionId: transaction.id,
    };
  }

  async patchTransaction(userId: string, transactionId: string, body: TransatcionPatchDto) {
    void userId;
    void body;

    // Sell line status updates are handled by TransactionStatusService.
    return { transactionId };
  }
}

export { TransactionService };
