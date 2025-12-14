import { afterAll, describe, expect, it } from 'vitest';

import prismaClient from '../../../../prisma/prismaClient.js';
import { ItemCategoryRepository } from '../itemCategoryRepository.js';
import { ItemRepository } from '../itemRepository.js';
import { ItemTypeRepository } from '../itemTypeRepository.js';

import { itemCategoriesMock, itemMock, itemTypesMock } from './mock.js';

const prisma = prismaClient;

const categoryRepo = new ItemCategoryRepository(prisma);
const typeRepo = new ItemTypeRepository(prisma);
const repo = new ItemRepository(prisma);

afterAll(async () => {
  await prisma.$disconnect();
});

describe('ItemRepository CRUD', () => {
  it('creates and reads an item', async () => {
    const category = await categoryRepo.create({
      data: itemCategoriesMock()[0],
    });
    const type = await typeRepo.create({ data: itemTypesMock(category.id)[0] });

    const created = await repo.create({ data: itemMock(type.id)[0] });
    const found = await repo.findUnique({ where: { id: created.id } });

    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe(created.name);
    expect(found?.item_type_id).toBe(type.id);
  });

  it('updates an item', async () => {
    const category = await categoryRepo.create({
      data: itemCategoriesMock()[0],
    });
    const type = await typeRepo.create({ data: itemTypesMock(category.id)[0] });
    const created = await repo.create({ data: itemMock(type.id)[0] });

    const updated = await repo.update({
      where: { id: created.id },
      data: { name: 'Updated', date_updated: new Date().toDateString() },
    });
    const found = await repo.findUnique({ where: { id: updated.id } });

    expect(found?.id).toBe(updated.id);
    expect(found?.name).toBe(updated.name);
    expect(found?.item_type_id).toBe(type.id);
  });

  it('delete an item', async () => {
    const category = await categoryRepo.create({
      data: itemCategoriesMock()[0],
    });
    const type = await typeRepo.create({ data: itemTypesMock(category.id)[0] });
    const created = await repo.create({ data: itemMock(type.id)[0] });

    const deleted = await repo.delete({
      where: { id: created.id },
    });

    const found = await repo.findUnique({ where: { id: created.id } });

    expect(deleted?.id).toBe(created.id);
    expect(found).toBeNull();
  });

  it('lists items', async () => {
    const category = await categoryRepo.create({
      data: itemCategoriesMock()[0],
    });
    const type = await typeRepo.create({ data: itemTypesMock(category.id)[0] });

    await repo.create({ data: itemMock(type.id)[0] });
    await repo.create({ data: itemMock(type.id)[1] });

    const all = await repo.findMany();

    expect(all.length).toBeGreaterThanOrEqual(2);
  });
});
