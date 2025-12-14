import { afterAll, describe, expect, it } from 'vitest';

import prismaClient from '../../../../prisma/prismaClient.js';
import { ItemCategoryRepository } from '../itemCategoryRepository.js';

import { itemCategoriesMock } from './mock.js';

const prisma = prismaClient;
const repo = new ItemCategoryRepository(prisma);

afterAll(async () => {
  await prisma.$disconnect();
});

describe('ItemCategoryRepository CRUD', () => {
  it('creates and reads an itemCategory', async () => {
    const created = await repo.create({ data: itemCategoriesMock()[0] });
    const found = await repo.findUnique({ where: { id: created.id } });

    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe(created.name);
  });

  it('updates a itemCategory', async () => {
    const created = await repo.create({ data: itemCategoriesMock()[0] });
    const updatedDate = new Date().toDateString();
    const updated = await repo.update({
      where: { id: created.id },
      data: { name: 'Updated', date_updated: updatedDate },
    });

    expect(updated.name).toBe('Updated');
    expect(updated.date_updated).toBe(updatedDate);
  });

  it('deletes a itemCategory', async () => {
    const created = await repo.create({ data: itemCategoriesMock()[0] });

    const deleted = await repo.delete({ where: { id: created.id } });
    const found = await repo.findUnique({ where: { id: created.id } });

    expect(found).toBeNull();
    expect(deleted.id).toBe(created.id);
  });

  it('lists categories', async () => {
    await repo.create({ data: itemCategoriesMock()[0] });
    await repo.create({ data: itemCategoriesMock()[1] });

    const all = await repo.findMany();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });
});
