import type { DatabaseClient } from '#prisma/prismaClient.js';
import type {
  PrismaMutationResponse,
  TransactionDto,
  TransactionBodyDto,
  TransactionCancelDto,
  TransactionStatusDto,
  TransactionStatusPatchDto,
  TransactionTypeDto,
} from '@eu/types';

import { LotService } from '#src/lib/services/prisma/lotService.js';
import { PedcardService } from '#src/lib/services/prisma/pedcardService.js';
import {
  transactionWithLinesInclude,
  type TransactionWithLines,
} from '#src/types/prismaApi/transactions.js';

export class TransactionService {
  constructor(private readonly prisma: DatabaseClient) {}

  parser(t: TransactionWithLines): TransactionDto {
    const qty = t.lines.reduce((t, c) => {
      return t + c.quantity;
    }, 0);
    const itemId = t.lines[0].lot.item_id;
    const lines = t.lines.map((m) => ({ quantity: m.quantity, lotId: m.lot_id, lot: { itemId } }));

    const parsed: TransactionDto = {
      id: t.id,
      tt: Number(t.tt),
      fee: Number(t.fee),
      ttc: Number(t.ttc),
      createdAt: t.created_at,
      updatedAt: t.updated_at ?? null,
      quantity: qty,
      entries: lines,
      userId: t.user_id,
      status: t.status ?? 'SOLDED',
      transactionType: t.transaction_type,
    };

    return parsed;
  }
  async getAll({
    userId,
    status,
    transactionType,
    itemId,
  }: {
    userId: string;
    itemId?: string;
    status?: TransactionStatusDto;
    transactionType?: TransactionTypeDto;
  }) {
    const rows = await this.prisma.transaction.findMany({
      where: {
        user_id: userId,
        status: status,
        transaction_type: transactionType,
        lines: itemId
          ? {
              some: {
                lot: {
                  item_id: itemId,
                },
              },
            }
          : undefined,
      },
      include: transactionWithLinesInclude,
    });

    const parsed = rows.map((m) => this.parser(m));

    return parsed;
  }
  async getById({ userId, id }: { userId: string; id: string }) {
    const row = await this.prisma.transaction.findUnique({
      where: { id, user_id: userId },

      include: transactionWithLinesInclude,
    });

    if (!row) return null;

    const parsed = this.parser(row);

    return parsed;
  }
  // async getRunningTransactions({
  //   userId,
  //   status,
  // }: {
  //   userId: string;
  //   status: TransactionStatusDto;
  // }): Promise<TransactionRunningDto[]> {
  //   const rows = await this.prisma.transaction.findMany({
  //     where: { user_id: userId, status },
  //     select: {
  //       id: true,
  //       tt: true,
  //       fee: true,
  //       ttc: true,
  //       lines: {
  //         select: {
  //           quantity: true,
  //           lot: {
  //             select: {
  //               item_id: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   if (!rows) return [];

  //   const result = rows.map((m) => {
  //     const quantity = m.lines.reduce((total, line) => total + line.quantity, 0);
  //     const itemId = m.lines[0]?.lot.item_id ?? null;

  //     return {
  //       id: m.id,
  //       tt: Number(m.tt),
  //       fee: Number(m.fee),
  //       ttc: Number(m.ttc),
  //       itemId,
  //       quantity,
  //     };
  //   });

  //   return result;
  // }
  async buy({
    body,
    userId,
  }: {
    userId: string;
    body: TransactionBodyDto;
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
          created_at: new Date().toISOString(),
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
          lotType: 'TRADE',
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
    body: TransactionBodyDto;
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
          created_at: new Date().toISOString(),
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
    status,
  }: {
    userId: string;
    id: string;
    status: TransactionStatusPatchDto;
  }) {
    const current = await this.getById({ userId, id });

    if (current?.status !== 'RUNNING') {
      throw new Error("A non running transaction can't be updated");
    }
    await this.prisma.$transaction(async (tx) => {
      if (status === 'SOLDED') {
        const ps = new PedcardService(tx);
        const tr = await this.prisma.transaction.update({
          where: { user_id: userId, id },
          data: { status },
        });
        await ps.create({
          userId,
          transactionId: id,
          body: { type: 'SELL_TTC', value: Number(tr.ttc) },
        });
      }

      if (status === 'RETURNED') {
        const ls = new LotService(tx);

        await tx.transaction.update({
          where: { user_id: userId, id },
          data: { status },
        });
        const entries = await tx.transactionLot.findMany({ where: { transaction_id: id } });

        await Promise.all(
          entries.map((m) => ls.remainingIncrement({ userId, id: m.lot_id, increment: m.quantity }))
        );
      }

      return;
    });
  }

  async cancel({
    userId,
    id,
    status,
  }: {
    userId: string;
    id: string;
    status: TransactionCancelDto;
  }) {
    await this.prisma.$transaction(async (tx) => {
      const ls = new LotService(tx);
      const ps = new PedcardService(tx);

      await tx.transaction.update({
        where: { user_id: userId, id },
        data: { status },
      });

      const entries = await tx.transactionLot.findMany({ where: { transaction_id: id } });

      await Promise.all(
        entries.map((m) => ls.remainingIncrement({ userId, id: m.lot_id, increment: m.quantity }))
      );

      await ps.deleteByTransactionId({
        userId,
        transactionId: id,
      });
    });
  }
}
