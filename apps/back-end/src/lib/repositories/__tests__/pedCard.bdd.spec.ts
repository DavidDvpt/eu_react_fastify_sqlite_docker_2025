import { randomUUID } from 'node:crypto';

import { afterAll, describe, expect, it } from 'vitest';

import prismaClient from '../../../../prisma/prismaClient.js';
import { PedcardService } from '../../services/pedcardService.js';
const prisma = prismaClient;
const pedCardService = new PedcardService();

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
  await pedCardService.deleteMany(userId);
  await prisma.user.delete({ where: { id: userId } });
}

describe('PedCard service', () => {
  it('detects an initial balance entry for a user', async () => {
    const userId = await createUser();

    try {
      await pedCardService.create({
        userId,
        type: 'INITIAL_BALANCE',
        value: 150,
      });

      await pedCardService.create({
        userId,
        type: 'BUY_TTC',
        value: -25,
      });

      const hasInitialBalance = await pedCardService.hasInitialBalance(userId);
      const hasInitialBalanceForUnknownUser = await pedCardService.hasInitialBalance(randomUUID());

      expect(hasInitialBalance).toBe(true);
      expect(hasInitialBalanceForUnknownUser).toBe(false);
    } finally {
      await cleanupUser(userId);
    }
  });

  it('sums every pedCard value for a user', async () => {
    const userId = await createUser();

    try {
      await pedCardService.createMany([
        {
          userId,
          type: 'INITIAL_BALANCE',
          value: 100,
        },
        {
          userId,
          type: 'BUY_TTC',
          value: 25.5,
        },
        {
          userId,
          type: 'ADJUSTMENT',
          value: -10,
        },
      ]);

      const balance = await pedCardService.getBalance(userId);

      expect(balance).toBe(115.5);
    } finally {
      await cleanupUser(userId);
    }
  });
});
