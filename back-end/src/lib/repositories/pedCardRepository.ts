import { PedCardTupleType } from '../../../prisma/generated/client.js';

import PrismaCrudRepository from './prismaCrudRepository.js';

import type { PedCardClient } from '../../types/index.js';

export class PedCardRepository extends PrismaCrudRepository<PedCardClient['pedCard']> {
  constructor(private readonly client: PedCardClient) {
    super(client.pedCard, { readScope: 'user-only', userField: 'userId' });
  }

  async hasInitialBalance(userId: string): Promise<boolean> {
    const row = await this.client.pedCard.findFirst({
      where: {
        userId,
        type: PedCardTupleType.INITIAL_BALANCE,
      },
      select: {
        id: true,
      },
    });

    return row !== null;
  }

  async getBalance(userId: string): Promise<number> {
    const aggregate = await this.client.pedCard.aggregate({
      where: {
        userId,
      },
      _sum: {
        value: true,
      },
    });

    const balance = aggregate._sum.value;
    return balance == null ? 0 : Number(balance.toString());
  }
}
