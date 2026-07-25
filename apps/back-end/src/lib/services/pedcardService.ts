import { PedCardTupleType } from '#prisma/generated/enums.js';
import prismaClient from '#prisma/prismaClient.js';

import type { PedCardFormBody } from '@eu/types';

export class PedcardService {
  private _client: typeof prismaClient.pedCard;
  constructor() {
    this._client = prismaClient.pedCard;
  }

  async hasInitialBalance(userId: string) {
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

  async getBalance(userId: string) {
    const aggregate = await this._client.aggregate({
      where: {
        user_id: userId,
      },
      _sum: {
        value: true,
      },
    });

    const balance = aggregate._sum.value;
    return balance == null ? 0 : Number(balance.toString());
  }

  async hasEnoughBalanceForEntry(userId: string, value: number): Promise<boolean> {
    const balance = await this.getBalance(userId);

    return balance >= value;
  }

  async create(body: PedCardFormBody): Promise<void> {
    await this._client.create({
      data: {
        user_id: body.userId,
        transaction_id: body.transactionId,
        value: body.value,
        type: body.type,
      },
    });
  }

  async createMany(entries: PedCardFormBody[]): Promise<void> {
    if (!entries.length) {
      return;
    }

    const parsedEntries = entries.map((m) => ({
      user_id: m.userId,
      transaction_id: m.transactionId,
      value: m.value,
      type: m.type,
    }));

    await this._client.createMany({
      data: parsedEntries,
    });
  }

  async deleteMany(userId: string) {
    await this._client.deleteMany({ where: { user_id: userId } });
  }
}
