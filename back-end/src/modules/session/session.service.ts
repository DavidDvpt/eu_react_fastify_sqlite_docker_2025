import type { UpdateSellLineStatusInput, UpdateSellLineStatusResult } from './session.type.js';
import type { PrismaClient, SessionStatus } from '../../../prisma/generated/client.js';

class SessionService {
  constructor(private readonly prisma: PrismaClient) {}

  async updateSellLineStatus(
    userId: string,
    input: UpdateSellLineStatusInput
  ): Promise<UpdateSellLineStatusResult> {
    return this.prisma.$transaction(async (tx) => {
      const line = await tx.sessionLine.findFirst({
        where: {
          id: input.sessionLineId,
          user_id: userId,
          line_type: 'OUT',
          sale_status: 'RUNNING',
        },
        select: {
          id: true,
          session_id: true,
          inventory_lot_id: true,
          quantity: true,
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

      await tx.sessionLine.update({
        where: { id: line.id },
        data: {
          sale_status: input.nextSaleStatus,
          line_status: 'CLOSED',
        },
      });

      const openedLinesCount = await tx.sessionLine.count({
        where: {
          session_id: line.session_id,
          user_id: userId,
          line_status: { not: 'CLOSED' },
        },
      });

      const nextSessionStatus: SessionStatus = openedLinesCount === 0 ? 'CLOSED' : 'OPENNED';

      await tx.session.update({
        where: { id: line.session_id },
        data: { status: nextSessionStatus },
      });

      return {
        sessionId: line.session_id,
        sessionLineId: line.id,
        saleStatus: input.nextSaleStatus,
        lineStatus: 'CLOSED',
        sessionStatus: nextSessionStatus,
      };
    });
  }
}

export { SessionService };
