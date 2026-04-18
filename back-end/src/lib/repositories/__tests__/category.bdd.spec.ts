import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import prismaClient from '../../../../prisma/prismaClient.js';
import { CategoryRepository } from '../categoryRepository.js';

import { itemCategoriesMock } from './mock.js';

const prisma = prismaClient;
const repo = new CategoryRepository(prisma);
const DEFAULT_OWNER_ID = '0FB0E33F-424C-4A2A-A135-FFF8A2D81E5E';

beforeAll(async () => {
  await prisma.user.createMany({
    data: [
      {
        id: DEFAULT_OWNER_ID,
        firstname: 'BDD',
        lastname: 'Owner',
        pseudo: `bdd-owner-${DEFAULT_OWNER_ID.toLowerCase()}`,
        email: `bdd-owner-${DEFAULT_OWNER_ID.toLowerCase()}@test.local`,
        password_hash: 'hashed',
        role: 'USER',
        date_created: new Date().toISOString(),
        date_updated: null,
        is_active: true,
      },
    ],
    skipDuplicates: true,
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('ItemCategoryRepository CRUD', () => {
  function createOwnerUserId() {
    return DEFAULT_OWNER_ID;
  }

  it('creates and reads an itemCategory', async () => {
    const ownerId = createOwnerUserId();
    const created = await repo.create({ data: itemCategoriesMock(ownerId)[0] });
    const found = await repo.findUnique({ where: { id: created.id } });

    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe(created.name);
  });

  it('updates a itemCategory', async () => {
    const ownerId = createOwnerUserId();
    const created = await repo.create({ data: itemCategoriesMock(ownerId)[0] });
    const updatedDate = new Date().toDateString();
    const updated = await repo.update({
      where: { id: created.id },
      data: { name: 'Updated', date_updated: updatedDate },
    });

    expect(updated.name).toBe('Updated');
    expect(updated.date_updated).toBe(updatedDate);
  });

  it('deletes a itemCategory', async () => {
    const ownerId = createOwnerUserId();
    const created = await repo.create({ data: itemCategoriesMock(ownerId)[0] });

    const deleted = await repo.delete({ where: { id: created.id } });
    const found = await repo.findUnique({ where: { id: created.id } });

    expect(found).toBeNull();
    expect(deleted.id).toBe(created.id);
  });

  it('lists categories', async () => {
    const ownerId = createOwnerUserId();
    await repo.create({ data: itemCategoriesMock(ownerId)[0] });
    await repo.create({ data: itemCategoriesMock(ownerId)[1] });

    const all = await repo.findMany();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });
});
