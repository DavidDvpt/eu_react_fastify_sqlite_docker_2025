import type {
  UpdateTransactionLineStatusInput,
  UpdateTransactionLineStatusResult,
} from './transactionStatus.type.js';
import type { PrismaClient, SessionStatus } from '../../../prisma/generated/client.js';

class TransactionStatusService {
  constructor(private readonly prisma: PrismaClient) {}

  async updateTransactionLineStatus(
    userId: string,
    input: UpdateTransactionLineStatusInput
  ): Promise<UpdateTransactionLineStatusResult> {
    return this.prisma.$transaction(async (tx) => {
      const line = await tx.transactionLot.findFirst({
        where: {
          id: input.transactionLotId,
          user_id: userId,
          line_type: 'OUT',
          sale_status: 'RUNNING',
        },
        select: {
          id: true,
          transaction_id: true,
          inventory_lot_id: true,
          quantity: true,
          ttc: true,
        },
      });

      if (!line) {
        throw new Error('SELL_RUNNING_LINE_NOT_FOUND');
      }

      if (input.nextSaleStatus === 'RETURNED') {
        if (!line.inventory_lot_id) {
          throw new Error('SELL_LINE_LOT_NOT_FOUND');
        }

        await tx.lot.update({
          where: { id: line.inventory_lot_id },
          data: {
            quantity_remaining: { increment: line.quantity },
            quantity_exported: { decrement: line.quantity },
            date_updated: new Date().toISOString(),
          },
        });
      }

      if (input.nextSaleStatus === 'SOLDED') {
        await tx.pedCard.upsert({
          where: {
            transactionId_type: {
              transactionId: line.transaction_id,
              type: 'SELL_TTC',
            },
          },
          create: {
            userId,
            transactionId: line.transaction_id,
            type: 'SELL_TTC',
            value: line.ttc,
          },
          update: {
            value: {
              increment: line.ttc,
            },
          },
        });
      }

      await tx.transactionLot.update({
        where: { id: line.id },
        data: {
          sale_status: input.nextSaleStatus,
          line_status: 'CLOSED',
        },
      });

      const openedLinesCount = await tx.transactionLot.count({
        where: {
          transaction_id: line.transaction_id,
          user_id: userId,
          line_status: { not: 'CLOSED' },
        },
      });

      const nextTransactionStatus: SessionStatus = openedLinesCount === 0 ? 'CLOSED' : 'OPENNED';

      await tx.transaction.update({
        where: { id: line.transaction_id },
        data: { status: nextTransactionStatus },
      });

      return {
        transactionId: line.transaction_id,
        transactionLotId: line.id,
        saleStatus: input.nextSaleStatus,
        lineStatus: 'CLOSED',
        transactionStatus: nextTransactionStatus,
      };
    });
  }
}

export { TransactionStatusService };
