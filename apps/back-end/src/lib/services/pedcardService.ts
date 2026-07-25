import type { PedCardFormOutputBody } from '@eu/types';

import { PedCardTupleType } from '#prisma/generated/enums.js';
import prismaClient from '#prisma/prismaClient.js';

export class PedcardService {
  private static _client = prismaClient.pedCard;
  constructor() {}

  private static pedcardFormParse(b: PedCardFormOutputBody) {
    return {
      user_id: b.userId,
      transaction_id: b.transactionId,
      value: b.value,
      type: b.type,
    };
  }
  static async hasInitialBalance(userId: string) {
    const row = await this._client.findFirst({
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

  static async getBalance(userId: string) {
    const aggregate = await this._client.aggregate({
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

  static async canPay(userId: string, value: number) {
    if (!userId || value) return false;

    const balance = await this.getBalance(userId);

    return balance >= value;
  }

  static async create(body: PedCardFormOutputBody) {
    const row = await this._client.create({
      data: this.pedcardFormParse(body),
    });

    return { id: row.id };
  }

  static async delete(id: string, userId: string) {
    const row = await this._client.delete({ where: { user_id: userId, id } });

    return { id: row.id };
  }
}
