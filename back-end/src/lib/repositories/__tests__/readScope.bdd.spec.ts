import { afterAll, describe, expect, it } from 'vitest';

import prismaClient from '../../../../prisma/prismaClient.js';
import {
  InventoryLotRepository,
  InventoryLotTransactionRepository,
  ItemCategoryRepository,
  ItemRepository,
  ItemTypeRepository,
  TransactionRepository,
  UserRepository,
} from '../index.js';

const prisma = prismaClient;

const userRepo = new UserRepository(prisma);
const categoryRepo = new ItemCategoryRepository(prisma);
const typeRepo = new ItemTypeRepository(prisma);
const itemRepo = new ItemRepository(prisma);
const lotRepo = new InventoryLotRepository(prisma);
const transactionRepo = new TransactionRepository(prisma);
const lotTransactionRepo = new InventoryLotTransactionRepository(prisma);

const now = () => new Date().toISOString();
const suffix = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

async function createUser(tag: string) {
  return userRepo.create({
    data: {
      firstname: tag,
      lastname: 'Scope',
      pseudo: `${tag}-${suffix()}`,
      email: `${tag}-${suffix()}@test.local`,
      password_hash: 'hashed',
      role: 'USER',
      date_created: now(),
      date_updated: null,
      is_active: true,
    },
  });
}

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Read scope by repository', () => {
  it('ItemCategory: reads global + current user only', async () => {
    const userA = await createUser('userA-category');
    const userB = await createUser('userB-category');

    const globalCategory = await categoryRepo.create({
      data: {
        name: `global-category-${suffix()}`,
        date_created: now(),
        date_updated: null,
        is_active: true,
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
    const userA = await createUser('userA-type');
    const userB = await createUser('userB-type');
    const baseCategory = await categoryRepo.create({
      data: {
        name: `type-category-${suffix()}`,
        date_created: now(),
        date_updated: null,
        is_active: true,
      },
    });

    const globalType = await typeRepo.create({
      data: {
        name: `global-type-${suffix()}`,
        category_id: baseCategory.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
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
    const userA = await createUser('userA-item');
    const userB = await createUser('userB-item');
    const baseCategory = await categoryRepo.create({
      data: {
        name: `item-category-${suffix()}`,
        date_created: now(),
        date_updated: null,
        is_active: true,
      },
    });
    const baseType = await typeRepo.create({
      data: {
        name: `item-type-${suffix()}`,
        category_id: baseCategory.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
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

  it('InventoryLot: reads current user only', async () => {
    const userA = await createUser('userA-lot');
    const userB = await createUser('userB-lot');
    const category = await categoryRepo.create({
      data: {
        name: `lot-category-${suffix()}`,
        date_created: now(),
        date_updated: null,
        is_active: true,
      },
    });
    const type = await typeRepo.create({
      data: {
        name: `lot-type-${suffix()}`,
        category_id: category.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
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

  it('Transaction: reads current user only', async () => {
    const userA = await createUser('userA-transaction');
    const userB = await createUser('userB-transaction');
    const category = await categoryRepo.create({
      data: {
        name: `transaction-category-${suffix()}`,
        date_created: now(),
        date_updated: null,
        is_active: true,
      },
    });
    const type = await typeRepo.create({
      data: {
        name: `transaction-type-${suffix()}`,
        category_id: category.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
      },
    });
    const item = await itemRepo.create({
      data: {
        name: `transaction-item-${suffix()}`,
        image_url_id: `img-${suffix()}`,
        value: 5,
        is_limited: false,
        item_type_id: type.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
      },
    });

    const txA = await transactionRepo.create({
      data: {
        transaction_type: 'PURCHASE',
        sell_status: 'RUNNING',
        quantity: 2,
        tt_value: 10,
        ttc_value: 12,
        fee: 2,
        date_created: now(),
        date_updated: null,
        is_active: true,
        item_id: item.id,
        user_id: userA.id,
      },
    });
    const txB = await transactionRepo.create({
      data: {
        transaction_type: 'GIFT',
        sell_status: 'RUNNING',
        quantity: 2,
        tt_value: 10,
        ttc_value: 12,
        fee: 2,
        date_created: now(),
        date_updated: null,
        is_active: true,
        item_id: item.id,
        user_id: userB.id,
      },
    });
    const txGlobal = await transactionRepo.create({
      data: {
        transaction_type: 'FOUND',
        sell_status: 'RUNNING',
        quantity: 2,
        tt_value: 10,
        ttc_value: 12,
        fee: 2,
        date_created: now(),
        date_updated: null,
        is_active: true,
        item_id: item.id,
      },
    });

    const forA = await transactionRepo.findMany(undefined, userA.id);
    expect(forA.map((t: { id: string }) => t.id)).toContain(txA.id);
    expect(forA.map((t: { id: string }) => t.id)).not.toContain(txB.id);
    expect(forA.map((t: { id: string }) => t.id)).not.toContain(txGlobal.id);

    const blocked = await transactionRepo.findUnique({ where: { id: txB.id } }, userA.id);
    expect(blocked).toBeNull();
  });

  it('InventoryLotTransaction: reads current user only', async () => {
    const userA = await createUser('userA-link');
    const userB = await createUser('userB-link');
    const category = await categoryRepo.create({
      data: {
        name: `link-category-${suffix()}`,
        date_created: now(),
        date_updated: null,
        is_active: true,
      },
    });
    const type = await typeRepo.create({
      data: {
        name: `link-type-${suffix()}`,
        category_id: category.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
      },
    });
    const item = await itemRepo.create({
      data: {
        name: `link-item-${suffix()}`,
        image_url_id: `img-${suffix()}`,
        value: 5,
        is_limited: false,
        item_type_id: type.id,
        date_created: now(),
        date_updated: null,
        is_active: true,
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
        quantity_remaining: 10,
        quantity_exported: 0,
        price_remaining: '50',
        item_id: item.id,
        lot_type: 'LOT',
        date_created: now(),
        date_updated: null,
        is_active: true,
        user_id: userB.id,
      },
    });

    const txA = await transactionRepo.create({
      data: {
        transaction_type: 'PURCHASE',
        sell_status: 'RUNNING',
        quantity: 1,
        tt_value: 10,
        ttc_value: 12,
        fee: 2,
        date_created: now(),
        date_updated: null,
        is_active: true,
        item_id: item.id,
        user_id: userA.id,
      },
    });
    const txB = await transactionRepo.create({
      data: {
        transaction_type: 'GIFT',
        sell_status: 'RUNNING',
        quantity: 1,
        tt_value: 10,
        ttc_value: 12,
        fee: 2,
        date_created: now(),
        date_updated: null,
        is_active: true,
        item_id: item.id,
        user_id: userB.id,
      },
    });

    const linkA = await lotTransactionRepo.create({
      data: {
        inventory_lot_id: lotA.id,
        transaction_id: txA.id,
        quantity: 1,
        user_id: userA.id,
      },
    });
    const linkB = await lotTransactionRepo.create({
      data: {
        inventory_lot_id: lotB.id,
        transaction_id: txB.id,
        quantity: 1,
        user_id: userB.id,
      },
    });

    const forA = await lotTransactionRepo.findMany(undefined, userA.id);
    expect(
      forA.map((l: { inventory_lot_id: string; transaction_id: string }) => `${l.inventory_lot_id}-${l.transaction_id}`)
    ).toContain(
      `${linkA.inventory_lot_id}-${linkA.transaction_id}`
    );
    expect(
      forA.map((l: { inventory_lot_id: string; transaction_id: string }) => `${l.inventory_lot_id}-${l.transaction_id}`)
    ).not.toContain(
      `${linkB.inventory_lot_id}-${linkB.transaction_id}`
    );

    const blocked = await lotTransactionRepo.findUnique(
      {
        where: {
          inventory_lot_id_transaction_id: {
            inventory_lot_id: linkB.inventory_lot_id,
            transaction_id: linkB.transaction_id,
          },
        },
      },
      userA.id
    );
    expect(blocked).toBeNull();
  });
});
