import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import prismaClient from '../../../../prisma/prismaClient.js';
import { ItemCategoryRepository } from '../itemCategoryRepository.js';
import { ItemTypeRepository } from '../itemTypeRepository.js';

import { itemCategoriesMock, itemTypesMock } from './mock.js';

const prisma = prismaClient;
const categoryRepo = new ItemCategoryRepository(prisma);
const repo = new ItemTypeRepository(prisma);
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

describe('ItemTypeRepository CRUD', () => {
  function createOwnerUserId() {
    return DEFAULT_OWNER_ID;
  }

  it('creates and reads an itemType', async () => {
    const ownerId = createOwnerUserId();
    const category = await categoryRepo.create({
      data: itemCategoriesMock(ownerId)[0],
    });
    const [type] = itemTypesMock(category.id, ownerId);
    const created = await repo.create({ data: type });
    const found = await repo.findUnique({ where: { id: created.id } });

    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe(created.name);
    expect(found?.category_id).toBe(category.id);
  });

  it('updates an itemType', async () => {
    const ownerId = createOwnerUserId();
    const category = await categoryRepo.create({
      data: itemCategoriesMock(ownerId)[0],
    });
    const [type] = itemTypesMock(category.id, ownerId);
    const created = await repo.create({ data: type });
    const updatedAt = new Date().toISOString();
    const updated = await repo.update({
      where: { id: created.id },
      data: { name: 'Updated Type', date_updated: updatedAt },
    });

    expect(updated.name).toBe('Updated Type');
    expect(updated.date_updated).toBe(updatedAt);
  });

  it('deletes an itemType', async () => {
    const ownerId = createOwnerUserId();
    const category = await categoryRepo.create({
      data: itemCategoriesMock(ownerId)[0],
    });
    const [type] = itemTypesMock(category.id, ownerId);
    const created = await repo.create({ data: type });

    const deleted = await repo.delete({ where: { id: created.id } });
    const found = await repo.findUnique({ where: { id: created.id } });

    expect(found).toBeNull();
    expect(deleted.id).toBe(created.id);
  });

  it('lists itemTypes', async () => {
    const ownerId = createOwnerUserId();
    const category = await categoryRepo.create({
      data: itemCategoriesMock(ownerId)[0],
    });
    const [typeA, typeB] = itemTypesMock(category.id, ownerId);
    await repo.create({ data: typeA });
    await repo.create({ data: typeB });

    const all = await repo.findMany();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });
});
