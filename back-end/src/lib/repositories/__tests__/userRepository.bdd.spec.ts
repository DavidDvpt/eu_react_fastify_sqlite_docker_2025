import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import prismaClient from '../../../../prisma/prismaClient.js';
import { UserRepository } from '../userRepository.js';

import { usersMock } from './mock.js';

const prisma = prismaClient;
const repo = new UserRepository(prisma);

beforeEach(async () => {
  // If User has relations, you may need to delete children first or use a transaction.
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('UserRepository CRUD', () => {
  it('creates and reads a user', async () => {
    const created = await repo.create({ data: usersMock()[0] });
    const found = await repo.findUnique({ where: { id: created.id } });

    expect(found?.id).toBe(created.id);
    expect(found?.pseudo).toBe(created.pseudo);
  });

  it('updates a user', async () => {
    const created = await repo.create({ data: usersMock()[0] });
    const updated = await repo.update({
      where: { id: created.id },
      data: { lastname: 'Updated' },
    });

    expect(updated.lastname).toBe('Updated');
  });

  it('deletes a user', async () => {
    const created = await repo.create({ data: usersMock()[1] });
    const deleted = await repo.delete({ where: { id: created.id } });
    const found = await repo.findUnique({ where: { id: created.id } });

    expect(found).toBeNull();
    expect(deleted?.id).toBe(created.id);
  });

  it('lists users', async () => {
    await repo.create({ data: usersMock()[0] });
    await repo.create({ data: usersMock()[1] });

    const all = await repo.findMany();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });
});
