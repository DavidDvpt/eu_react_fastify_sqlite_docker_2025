import { randomUUID } from 'node:crypto';

import { afterAll, describe, expect, it } from 'vitest';

import prismaClient from '../../../../prisma/prismaClient.js';
import { PedcardService } from '../pedcardService.js';

const prisma = prismaClient;
const service = new PedcardService(prismaClient);

afterAll(async () => {
  await prisma.$disconnect();
});

async function createUser() {
  const id = randomUUID();
  await prisma.user.create({
    data: {
      id,
      firstname: 'BDD',
      lastname: 'User',
      pseudo: `bdd-pedcard-${id.slice(0, 8)}`,
      email: `bdd-pedcard-${id}@test.local`,
      password_hash: 'hashed',
      role: 'USER',
      date_created: new Date().toISOString(),
      date_updated: null,
      is_active: true,
    },
  });

  return id;
}

async function cleanupUser(userId: string) {
  await prisma.pedCard.deleteMany({ where: { user_id: userId } });
  await prisma.user.delete({ where: { id: userId } });
}

describe('PedcardService', () => {
  it('detects an initial balance entry for a user', async () => {
    const userId = await createUser();

    try {
      await service.create({
        userId,
        body: {
          type: 'INITIAL_BALANCE',
          value: 150,
        },
      });
      await service.create({
        userId,
        body: {
          type: 'BUY_TTC',
          value: -25,
        },
      });

      const hasInitialBalance = await service.hasInitialBalance({ userId });
      const hasInitialBalanceForUnknownUser = await service.hasInitialBalance({
        userId: randomUUID(),
      });

      expect(hasInitialBalance).toBe(true);
      expect(hasInitialBalanceForUnknownUser).toBe(false);
    } finally {
      await cleanupUser(userId);
    }
  });

  it('sums every pedCard value for a user', async () => {
    const userId = await createUser();

    try {
      const transaction = await prisma.transaction.create({
        data: {
          user_id: userId,
          transaction_type: 'BUY',
          tt: 0,
          ttc: 0,
          fee: 0,
        },
      });

      await service.createMany({
        userId,
        transactionId: transaction.id,
        bodys: [
          {
            type: 'INITIAL_BALANCE',
            value: 100,
          },
          {
            type: 'BUY_TTC',
            value: 25.5,
          },
          {
            type: 'ADJUSTMENT',
            value: -10,
          },
        ],
      });

      const balance = await service.getBalance({ userId });

      expect(balance).toBe(115.5);
    } finally {
      await cleanupUser(userId);
    }
  });
});
