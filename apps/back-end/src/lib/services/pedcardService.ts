import type { PedCardFormOutputBody } from '@eu/types';

import { PedCardTupleType } from '#prisma/generated/enums.js';
import { type DatabaseClient } from '#prisma/prismaClient.js';

export class PedcardService {
  constructor(private readonly prisma: DatabaseClient) {}

  private pedcardFormParse(b: PedCardFormOutputBody) {
    return {
      transaction_id: b.transactionId,
      value: b.value,
      type: b.type,
    };
  }
  async hasInitialBalance({ userId }: { userId: string }) {
    const row = await this.prisma.pedCard.findFirst({
      where: {
        user_id: userId,
        type: PedCardTupleType.INITIAL_BALANCE,
      },
      select: {
        id: true,
      },
    });

    return row !== null;
  }

  async getBalance({ userId }: { userId: string }) {
    const aggregate = await this.prisma.pedCard.aggregate({
      where: {
        user_id: userId,
      },
      _sum: {
        value: true,
      },
    });

    const balance = aggregate._sum.value;
    return balance === null ? 0 : Number(balance.toString());
  }

  async canPay({ userId, value }: { userId: string; value: number }) {
    if (!userId || value) return false;

    const balance = await this.getBalance({ userId });

    return balance >= value;
  }

  async create({ userId, body }: { userId: string; body: PedCardFormOutputBody }) {
    const data = this.pedcardFormParse(body);
    const row = await this.prisma.pedCard.create({
      data: { ...data, user_id: userId },
    });

    return { id: row.id };
  }

  async update({ userId, id, body }: { id: string; userId: string; body: PedCardFormOutputBody }) {
    const row = await this.prisma.pedCard.update({
      where: { user_id: userId, id },
      data: { type: body.type, user_id: userId, value: body.value },
    });

    return { id: row.id };
  }

  async delete({ id, userId }: { id: string; userId: string }) {
    const row = await this.prisma.pedCard.delete({ where: { user_id: userId, id } });

    return { id: row.id };
  }
}
