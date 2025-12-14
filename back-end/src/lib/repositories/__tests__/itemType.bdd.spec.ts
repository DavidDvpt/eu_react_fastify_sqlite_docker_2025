import { afterAll, describe, expect, it } from 'vitest';

import prismaClient from '../../../../prisma/prismaClient.js';
import { ItemCategoryRepository } from '../itemCategoryRepository.js';
import { ItemTypeRepository } from '../itemTypeRepository.js';

import { itemCategoriesMock, itemTypesMock } from './mock.js';

const prisma = prismaClient;
const categoryRepo = new ItemCategoryRepository(prisma);
const repo = new ItemTypeRepository(prisma);

afterAll(async () => {
  await prisma.$disconnect();
});

describe('ItemTypeRepository CRUD', () => {
  it('creates and reads an itemType', async () => {
    const category = await categoryRepo.create({
      data: itemCategoriesMock()[0],
    });
    const [type] = itemTypesMock(category.id);
    const created = await repo.create({ data: type });
    const found = await repo.findUnique({ where: { id: created.id } });

    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe(created.name);
    expect(found?.category_id).toBe(category.id);
  });

  it('updates an itemType', async () => {
    const category = await categoryRepo.create({
      data: itemCategoriesMock()[0],
    });
    const [type] = itemTypesMock(category.id);
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
    const category = await categoryRepo.create({
      data: itemCategoriesMock()[0],
    });
    const [type] = itemTypesMock(category.id);
    const created = await repo.create({ data: type });

    const deleted = await repo.delete({ where: { id: created.id } });
    const found = await repo.findUnique({ where: { id: created.id } });

    expect(found).toBeNull();
    expect(deleted.id).toBe(created.id);
  });

  it('lists itemTypes', async () => {
    const category = await categoryRepo.create({
      data: itemCategoriesMock()[0],
    });
    const [typeA, typeB] = itemTypesMock(category.id);
    await repo.create({ data: typeA });
    await repo.create({ data: typeB });

    const all = await repo.findMany();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });
});
