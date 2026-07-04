import { randomUUID } from 'node:crypto';

import { afterAll, describe, expect, it } from 'vitest';

import prismaClient from '../../../../prisma/prismaClient.js';
import { PedCardRepository } from '../pedCardRepository.js';

const prisma = prismaClient;
const repo = new PedCardRepository(prisma);

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
  await prisma.pedCard.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
}

describe('PedCardRepository', () => {
  it('detects an initial balance entry for a user', async () => {
    const userId = await createUser();

    try {
      await prisma.pedCard.create({
        data: {
          userId,
          transactionId: null,
          type: 'INITIAL_BALANCE',
          value: 150,
        },
      });

      await prisma.pedCard.create({
        data: {
          userId,
          transactionId: null,
          type: 'BUY_TTC',
          value: -25,
        },
      });

      const hasInitialBalance = await repo.hasInitialBalance(userId);
      const hasInitialBalanceForUnknownUser = await repo.hasInitialBalance(randomUUID());

      expect(hasInitialBalance).toBe(true);
      expect(hasInitialBalanceForUnknownUser).toBe(false);
    } finally {
      await cleanupUser(userId);
    }
  });

  it('sums every pedCard value for a user', async () => {
    const userId = await createUser();

    try {
      await prisma.pedCard.createMany({
        data: [
          {
            userId,
            transactionId: null,
            type: 'INITIAL_BALANCE',
            value: 100,
          },
          {
            userId,
            transactionId: null,
            type: 'BUY_TTC',
            value: 25.5,
          },
          {
            userId,
            transactionId: null,
            type: 'ADJUSTMENT',
            value: -10,
          },
        ],
      });

      const balance = await repo.getBalance(userId);

      expect(balance).toBe(115.5);
    } finally {
      await cleanupUser(userId);
    }
  });
});
