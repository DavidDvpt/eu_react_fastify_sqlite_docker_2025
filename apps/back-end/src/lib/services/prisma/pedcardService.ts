import type { PedCard } from '#prisma/generated/client.js';
import type {
  PedcardDto,
  PedCardFormBody,
  PedCardTypeDto,
  PrismaMutationResponse,
} from '@eu/types';

import { PedCardTupleType } from '#prisma/generated/enums.js';
import { type DatabaseClient } from '#prisma/prismaClient.js';

const PEDCARD_INSUFFICIENT_BALANCE_ERROR = 'PEDCARD_INSUFFICIENT_BALANCE';
export class PedcardService {
  constructor(private readonly prisma: DatabaseClient) {}

  private pedcardFormParse(b: PedCardFormBody) {
    return {
      transaction_id: b.transactionId,
      value: b.value,
      type: b.type,
    };
  }

  private parser(value: PedCard) {
    if (!value) return null;

    const parsed: PedcardDto = {
      id: value.id,
      createdat: value.created_at,
      type: value.type as PedCardTypeDto,
      transactionId: value.transaction_id,
      userId: value.user_id,
      value: Number(value.value),
    };

    return parsed;
  }

  async getAll({ userId }: { userId: string }) {
    const rows = await this.prisma.pedCard.findMany({
      where: {
        user_id: userId,
      },
    });

    const parsed = rows.map((m) => this.parser(m));

    return parsed;
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

    if (balance > value) throw new Error(PEDCARD_INSUFFICIENT_BALANCE_ERROR);

    return true;
  }

  async create({
    userId,
    transactionId,
    body,
  }: {
    userId: string;
    body: PedCardFormBody;
    transactionId?: string;
  }) {
    const data = this.pedcardFormParse(body);
    const row = await this.prisma.pedCard.create({
      data: {
        ...data,
        user_id: userId,
        transaction_id: transactionId,
        created_at: new Date().toISOString(),
      },
    });

    return { id: row.id };
  }
  async createMany({
    userId,
    transactionId,
    bodys,
  }: {
    userId: string;
    transactionId: string;
    bodys: PedCardFormBody[];
  }): Promise<PrismaMutationResponse[]> {
    const datas = bodys.map((b) => this.pedcardFormParse({ ...b, transactionId }));

    const results = await Promise.all(
      datas.map((m) =>
        this.prisma.pedCard.create({
          data: { ...m, user_id: userId, created_at: new Date().toISOString() },
        })
      )
    );

    return results.map((m) => ({ id: m.id }));
  }

  async update({ userId, id, body }: { id: string; userId: string; body: PedCardFormBody }) {
    const row = await this.prisma.pedCard.update({
      where: { user_id: userId, id },
      data: {
        type: body.type,
        value: body.value,
        updated_at: new Date().toISOString(),
      },
    });

    return { id: row.id };
  }

  async delete({ id, userId }: { id: string; userId: string }) {
    const row = await this.prisma.pedCard.delete({ where: { user_id: userId, id } });

    return { id: row.id };
  }
}
