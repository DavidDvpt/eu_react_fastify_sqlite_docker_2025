import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import prismaClient from '../../../../prisma/prismaClient.js';
import {
  LotRepository,
  ItemCategoryRepository,
  ItemRepository,
  ItemTypeRepository,
} from '../index.js';

const prisma = prismaClient;

const categoryRepo = new ItemCategoryRepository(prisma);
const typeRepo = new ItemTypeRepository(prisma);
const itemRepo = new ItemRepository(prisma);
const lotRepo = new LotRepository(prisma);
const SYSTEM_USER_ID = process.env.SYSTEM_USER_ID ?? '8E3A0E4C-9F64-4C8E-A2B5-7DFA4A9F3C11';
const USER_A_ID = '0FB0E33F-424C-4A2A-A135-FFF8A2D81E5E';
const USER_B_ID = '1947DAFD-0CA4-4673-8F25-EB4702265ACA';

const now = () => new Date().toISOString();
const suffix = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

beforeAll(async () => {
  await prisma.user.createMany({
    data: [
      {
        id: SYSTEM_USER_ID,
        firstname: 'System',
        lastname: 'User',
        pseudo: `system-${SYSTEM_USER_ID.toLowerCase()}`,
        email: `system-${SYSTEM_USER_ID.toLowerCase()}@test.local`,
        password_hash: 'hashed',
        role: 'ADMIN',
        date_created: now(),
        date_updated: null,
        is_active: true,
      },
      {
        id: USER_A_ID,
        firstname: 'User',
        lastname: 'A',
        pseudo: `user-a-${USER_A_ID.toLowerCase()}`,
        email: `user-a-${USER_A_ID.toLowerCase()}@test.local`,
        password_hash: 'hashed',
        role: 'USER',
        date_created: now(),
        date_updated: null,
        is_active: true,
      },
      {
        id: USER_B_ID,
        firstname: 'User',
        lastname: 'B',
        pseudo: `user-b-${USER_B_ID.toLowerCase()}`,
        email: `user-b-${USER_B_ID.toLowerCase()}@test.local`,
        password_hash: 'hashed',
        role: 'USER',
        date_created: now(),
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

describe('Read scope by repository', () => {
  it('ItemCategory: reads global + current user only', async () => {
    const userA = { id: USER_A_ID };
    const userB = { id: USER_B_ID };

    const globalCategory = await categoryRepo.create({
      data: {
        name: `global-category-${suffix()}`,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: SYSTEM_USER_ID,
      },
    });
    const categoryA = await categoryRepo.create({
      data: {
        name: `category-a-${suffix()}`,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userA.id,
      },
    });
    const categoryB = await categoryRepo.create({
      data: {
        name: `category-b-${suffix()}`,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userB.id,
      },
    });

    const forA = await categoryRepo.findMany(undefined, userA.id);
    expect(forA.map((c: { id: string }) => c.id)).toContain(globalCategory.id);
    expect(forA.map((c: { id: string }) => c.id)).toContain(categoryA.id);
    expect(forA.map((c: { id: string }) => c.id)).not.toContain(categoryB.id);

    const blocked = await categoryRepo.findUnique({ where: { id: categoryB.id } }, userA.id);
    expect(blocked).toBeNull();
  });

  it('ItemType: reads global + current user only', async () => {
    const userA = { id: USER_A_ID };
    const userB = { id: USER_B_ID };
    const baseCategory = await categoryRepo.create({
      data: {
        name: `type-category-${suffix()}`,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: SYSTEM_USER_ID,
      },
    });

    const globalType = await typeRepo.create({
      data: {
        name: `global-type-${suffix()}`,
        category_id: baseCategory.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: SYSTEM_USER_ID,
      },
    });
    const typeA = await typeRepo.create({
      data: {
        name: `type-a-${suffix()}`,
        category_id: baseCategory.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userA.id,
      },
    });
    const typeB = await typeRepo.create({
      data: {
        name: `type-b-${suffix()}`,
        category_id: baseCategory.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userB.id,
      },
    });

    const forA = await typeRepo.findMany(undefined, userA.id);
    expect(forA.map((t: { id: string }) => t.id)).toContain(globalType.id);
    expect(forA.map((t: { id: string }) => t.id)).toContain(typeA.id);
    expect(forA.map((t: { id: string }) => t.id)).not.toContain(typeB.id);

    const blocked = await typeRepo.findUnique({ where: { id: typeB.id } }, userA.id);
    expect(blocked).toBeNull();
  });

  it('Item: reads global + current user only', async () => {
    const userA = { id: USER_A_ID };
    const userB = { id: USER_B_ID };
    const baseCategory = await categoryRepo.create({
      data: {
        name: `item-category-${suffix()}`,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: SYSTEM_USER_ID,
      },
    });
    const baseType = await typeRepo.create({
      data: {
        name: `item-type-${suffix()}`,
        category_id: baseCategory.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: SYSTEM_USER_ID,
      },
    });

    const globalItem = await itemRepo.create({
      data: {
        name: `global-item-${suffix()}`,
        image_url_id: `img-${suffix()}`,
        value: 10,
        is_limited: false,
        item_type_id: baseType.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: SYSTEM_USER_ID,
      },
    });
    const itemA = await itemRepo.create({
      data: {
        name: `item-a-${suffix()}`,
        image_url_id: `img-${suffix()}`,
        value: 20,
        is_limited: true,
        item_type_id: baseType.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userA.id,
      },
    });
    const itemB = await itemRepo.create({
      data: {
        name: `item-b-${suffix()}`,
        image_url_id: `img-${suffix()}`,
        value: 30,
        is_limited: true,
        item_type_id: baseType.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userB.id,
      },
    });

    const forA = await itemRepo.findMany(undefined, userA.id);
    expect(forA.map((i: { id: string }) => i.id)).toContain(globalItem.id);
    expect(forA.map((i: { id: string }) => i.id)).toContain(itemA.id);
    expect(forA.map((i: { id: string }) => i.id)).not.toContain(itemB.id);

    const blocked = await itemRepo.findUnique({ where: { id: itemB.id } }, userA.id);
    expect(blocked).toBeNull();
  });

  it('Lot: reads current user only', async () => {
    const userA = { id: USER_A_ID };
    const userB = { id: USER_B_ID };
    const category = await categoryRepo.create({
      data: {
        name: `lot-category-${suffix()}`,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userA.id,
      },
    });
    const type = await typeRepo.create({
      data: {
        name: `lot-type-${suffix()}`,
        category_id: category.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userA.id,
      },
    });
    const item = await itemRepo.create({
      data: {
        name: `lot-item-${suffix()}`,
        image_url_id: `img-${suffix()}`,
        value: 5,
        is_limited: false,
        item_type_id: type.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userA.id,
      },
    });

    const lotA = await lotRepo.create({
      data: {
        quantity_remaining: 10,
        quantity_exported: 0,
        price_remaining: '50',
        item_id: item.id,
        lot_type: 'LOT',
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userA.id,
      },
    });
    const lotB = await lotRepo.create({
      data: {
        quantity_remaining: 11,
        quantity_exported: 0,
        price_remaining: '55',
        item_id: item.id,
        lot_type: 'LOT',
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userB.id,
      },
    });
    const lotGlobal = await lotRepo.create({
      data: {
        quantity_remaining: 12,
        quantity_exported: 0,
        price_remaining: '60',
        item_id: item.id,
        lot_type: 'LOT',
        date_created: now(),
        date_updated: null,
        is_active: true,
      },
    });

    const forA = await lotRepo.findMany(undefined, userA.id);
    expect(forA.map((l: { id: string }) => l.id)).toContain(lotA.id);
    expect(forA.map((l: { id: string }) => l.id)).not.toContain(lotB.id);
    expect(forA.map((l: { id: string }) => l.id)).not.toContain(lotGlobal.id);

    const blocked = await lotRepo.findUnique({ where: { id: lotB.id } }, userA.id);
    expect(blocked).toBeNull();
  });

  it('ItemCategory: update/delete allowed only for owner, global rows are read-only', async () => {
    const userA = { id: USER_A_ID };
    const userB = { id: USER_B_ID };

    const globalCategory = await categoryRepo.create({
      data: {
        name: `global-category-mutation-${suffix()}`,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: SYSTEM_USER_ID,
      },
    });
    const categoryA = await categoryRepo.create({
      data: {
        name: `category-owner-a-${suffix()}`,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userA.id,
      },
    });
    const categoryB = await categoryRepo.create({
      data: {
        name: `category-owner-b-${suffix()}`,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userB.id,
      },
    });

    await expect(
      categoryRepo.update(
        {
          where: { id: globalCategory.id },
          data: { name: `forbidden-global-update-${suffix()}` },
        },
        userA.id
      )
    ).rejects.toThrow('Forbidden mutation');

    await expect(
      categoryRepo.update(
        {
          where: { id: categoryB.id },
          data: { name: `forbidden-other-user-update-${suffix()}` },
        },
        userA.id
      )
    ).rejects.toThrow('Forbidden mutation');

    const updatedByOwner = await categoryRepo.update(
      {
        where: { id: categoryA.id },
        data: { name: `owner-update-${suffix()}` },
      },
      userA.id
    );
    expect(updatedByOwner.id).toBe(categoryA.id);

    await expect(categoryRepo.delete({ where: { id: globalCategory.id } }, userA.id)).rejects.toThrow(
      'Forbidden mutation'
    );
    await expect(categoryRepo.delete({ where: { id: categoryB.id } }, userA.id)).rejects.toThrow(
      'Forbidden mutation'
    );

    const deletedByOwner = await categoryRepo.delete({ where: { id: categoryA.id } }, userA.id);
    expect(deletedByOwner.id).toBe(categoryA.id);
  });

  it('Lot: update/delete allowed only for owner, global rows are read-only', async () => {
    const userA = { id: USER_A_ID };
    const userB = { id: USER_B_ID };
    const category = await categoryRepo.create({
      data: {
        name: `lot-mutation-category-${suffix()}`,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userA.id,
      },
    });
    const type = await typeRepo.create({
      data: {
        name: `lot-mutation-type-${suffix()}`,
        category_id: category.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userA.id,
      },
    });
    const item = await itemRepo.create({
      data: {
        name: `lot-mutation-item-${suffix()}`,
        image_url_id: `img-${suffix()}`,
        value: 8,
        is_limited: false,
        item_type_id: type.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userA.id,
      },
    });

    const lotA = await lotRepo.create({
      data: {
        quantity_remaining: 7,
        quantity_exported: 0,
        price_remaining: '70',
        item_id: item.id,
        lot_type: 'LOT',
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userA.id,
      },
    });
    const lotB = await lotRepo.create({
      data: {
        quantity_remaining: 8,
        quantity_exported: 0,
        price_remaining: '80',
        item_id: item.id,
        lot_type: 'LOT',
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userB.id,
      },
    });
    const lotGlobal = await lotRepo.create({
      data: {
        quantity_remaining: 9,
        quantity_exported: 0,
        price_remaining: '90',
        item_id: item.id,
        lot_type: 'LOT',
        date_created: now(),
        date_updated: null,
        is_active: true,
      },
    });

    await expect(
      lotRepo.update(
        {
          where: { id: lotGlobal.id },
          data: { quantity_remaining: 99 },
        },
        userA.id
      )
    ).rejects.toThrow('Forbidden mutation');
    await expect(
      lotRepo.update(
        {
          where: { id: lotB.id },
          data: { quantity_remaining: 99 },
        },
        userA.id
      )
    ).rejects.toThrow('Forbidden mutation');

    const updatedByOwner = await lotRepo.update(
      {
        where: { id: lotA.id },
        data: { quantity_remaining: 42 },
      },
      userA.id
    );
    expect(updatedByOwner.quantity_remaining).toBe(42);

    await expect(lotRepo.delete({ where: { id: lotGlobal.id } }, userA.id)).rejects.toThrow(
      'Forbidden mutation'
    );
    await expect(lotRepo.delete({ where: { id: lotB.id } }, userA.id)).rejects.toThrow(
      'Forbidden mutation'
    );

    const deletedByOwner = await lotRepo.delete({ where: { id: lotA.id } }, userA.id);
    expect(deletedByOwner.id).toBe(lotA.id);
  });
});
