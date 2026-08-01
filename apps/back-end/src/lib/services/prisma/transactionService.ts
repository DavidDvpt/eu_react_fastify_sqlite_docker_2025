import type { DatabaseClient } from '#prisma/prismaClient.js';
import type {
  PrismaMutationResponse,
  TransactionDto,
  TransactionFormOutputBody,
  TransactionWhereOptions,
} from '@eu/types';

import { LotService } from '#src/lib/services/prisma/lotService.js';
import { PedcardService } from '#src/lib/services/prisma/pedcardService.js';
import {
  transactionWithLinesInclude,
  type TransactionWithLines,
} from '#src/types/prismaApi/transactions.js';

export class TransactionService {
  constructor(private readonly prisma: DatabaseClient) {}

  parsePrismaToDto(t: TransactionWithLines): TransactionDto {
    const qty = t.lines.reduce((t, c) => {
      return t + c.quantity;
    }, 0);
    const lines = t.lines.map((m) => ({ quantity: m.quantity, lotId: m.lot_id }));
    const lotIds = t.lines.map((m) => m.lot_id);
    const itemId = t.lines[0].lot.item_id;

    const parsed: TransactionDto = {
      id: t.id,
      tt: Number(t.tt),
      fee: Number(t.fee),
      ttc: Number(t.ttc),
      createdAt: t.created_at.toISOString(),
      updatedAt: t.updated_at?.toISOString() ?? null,
      quantity: qty,
      lines,
      lotIds,
      itemId,
      status: t.status ?? 'SOLDED',
      transactionType: t.transaction_type,
    };

    return parsed;
  }
  async getAll({
    userId,
    whereOptions,
  }: {
    userId: string;
    whereOptions: TransactionWhereOptions;
  }) {
    const rows = await this.prisma.transaction.findMany({
      where: {
        user_id: userId,
        status: whereOptions?.status,
        transaction_type: whereOptions.type,
        lines: whereOptions.itemId
          ? {
              some: {
                lot: {
                  item_id: whereOptions.itemId,
                },
              },
            }
          : undefined,
      },
      include: transactionWithLinesInclude,
    });

    const parsed = rows.map((m) => this.parsePrismaToDto(m));

    return parsed;
  }
  async getById({ userId, id }: { userId: string; id: string }) {
    const row = await this.prisma.transaction.findUnique({
      where: { id, user_id: userId },
      include: transactionWithLinesInclude,
    });

    if (!row) return null;

    const parsed = this.parsePrismaToDto(row);

    return parsed;
  }
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
          transaction_type: body.transactionType,
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
          transaction_type: body.transactionType,
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

  async updateStatus({
    userId,
    id,
    body,
  }: {
    userId: string;
    id: string;
    body: Partial<Pick<TransactionFormOutputBody, 'status'>>;
  }) {
    if (body.status) {
      const current = await this.getById({ userId, id });
      if (current?.status === 'RUNNING') {
        if (body.status === 'SOLDED') {
          await this.prisma.transaction.update({
            where: { user_id: userId, id },
            data: { status: body.status },
          });
        }
        if (body.status === 'RETURNED') {
          await this.prisma.$transaction(async (tx) => {
            await tx.transaction.update({
              where: { user_id: userId, id },
              data: { status: body.status },
            });

            await Promise.all(
              current.lines.map((m) =>
                tx.lot.update({
                  where: { user_id: userId, id: m.lotId },
                  data: {
                    quantity_remaining: {
                      increment: m.quantity,
                    },
                  },
                })
              )
            );
          });
        }
      }
    }

    return { id };
  }
  // async patchTransaction(userId: string, transactionId: string, body: TransatcionPatchDto) {
  //   void userId;
  //   void body;

  //   // Sell line status updates are handled by TransactionStatusService.
  //   return { transactionId };
  // }})
}
