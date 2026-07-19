import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import prismaClient from '../../../../prisma/prismaClient.js';

import { itemCategoriesMock, itemMock, itemTypesMock } from './mock.js';

const prisma = prismaClient;
const prismaCategory = prisma.category;
const prismaType = prisma.type;
const prismaItem = prisma.item;
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

describe('ItemRepository CRUD', () => {
  function createOwnerUserId() {
    return DEFAULT_OWNER_ID;
  }

  it('creates and reads an item', async () => {
    const ownerId = createOwnerUserId();
    const category = await prismaCategory.create({
      data: itemCategoriesMock(ownerId)[0],
    });
    const type = await prismaType.create({ data: itemTypesMock(category.id, ownerId)[0] });

    const created = await prismaItem.create({ data: itemMock(type.id, ownerId)[0] });
    const found = await prismaItem.findUnique({ where: { id: created.id } });

    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe(created.name);
    expect(found?.item_type_id).toBe(type.id);
  });

  it('updates an item', async () => {
    const ownerId = createOwnerUserId();
    const category = await prismaCategory.create({
      data: itemCategoriesMock(ownerId)[0],
    });
    const type = await prismaType.create({ data: itemTypesMock(category.id, ownerId)[0] });
    const created = await prismaItem.create({ data: itemMock(type.id, ownerId)[0] });

    const updated = await prismaItem.update({
      where: { id: created.id },
      data: { name: 'Updated', date_updated: new Date().toDateString() },
    });
    const found = await prismaItem.findUnique({ where: { id: updated.id } });

    expect(found?.id).toBe(updated.id);
    expect(found?.name).toBe(updated.name);
    expect(found?.item_type_id).toBe(type.id);
  });

  it('delete an item', async () => {
    const ownerId = createOwnerUserId();
    const category = await prismaCategory.create({
      data: itemCategoriesMock(ownerId)[0],
    });
    const type = await prismaType.create({ data: itemTypesMock(category.id, ownerId)[0] });
    const created = await prismaItem.create({ data: itemMock(type.id, ownerId)[0] });

    const deleted = await prismaItem.delete({
      where: { id: created.id },
    });

    const found = await prismaItem.findUnique({ where: { id: created.id } });

    expect(deleted?.id).toBe(created.id);
    expect(found).toBeNull();
  });

  it('lists items', async () => {
    const ownerId = createOwnerUserId();
    const category = await prismaCategory.create({
      data: itemCategoriesMock(ownerId)[0],
    });
    const type = await prismaType.create({ data: itemTypesMock(category.id, ownerId)[0] });

    await prismaItem.create({ data: itemMock(type.id, ownerId)[0] });
    await prismaItem.create({ data: itemMock(type.id, ownerId)[1] });

    const all = await prismaItem.findMany();

    expect(all.length).toBeGreaterThanOrEqual(2);
  });
});
