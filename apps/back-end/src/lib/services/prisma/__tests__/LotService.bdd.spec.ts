/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi } from 'vitest';

import { LotService } from '../lotService.js';

describe('LotService', () => {
  it('reads one lot by id', async () => {
    const prisma = {
      lot: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'lot-1',
          item_id: 'item-1',
          is_active: true,
          price_remaining: 10,
          quantity_exported: 1,
          quantity_remaining: 2,
          lot_type: 'TRADE',
          date_created: '2026-08-01T10:00:00.000Z',
          date_updated: null,
        }),
      },
    };
    const service = new LotService(prisma as any);

    const found = await service.getById({ id: 'lot-1', userId: 'user-1' });

    expect(prisma.lot.findUnique).toHaveBeenCalledWith({
      where: { user_id: 'user-1', id: 'lot-1' },
    });
    expect(found).toEqual({
      id: 'lot-1',
      itemId: 'item-1',
      isActive: true,
      priceRemaining: 10,
      quantityExported: 1,
      quantityRemaining: 2,
      lotType: 'TRADE',
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: null,
    });
  });

  it('sorts lots by quantityRemaining in ascending and descending order', async () => {
    const prisma = {
      lot: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'lot-1',
            item_id: 'item-1',
            is_active: true,
            price_remaining: 10,
            quantity_exported: 0,
            quantity_remaining: 2,
            lot_type: 'BUY',
            date_created: '2026-08-01T10:00:00.000Z',
            date_updated: null,
          },
          {
            id: 'lot-2',
            item_id: 'item-1',
            is_active: true,
            price_remaining: 20,
            quantity_exported: 0,
            quantity_remaining: 10,
            lot_type: 'BUY',
            date_created: '2026-08-01T11:00:00.000Z',
            date_updated: null,
          },
          {
            id: 'lot-3',
            item_id: 'item-1',
            is_active: true,
            price_remaining: 30,
            quantity_exported: 0,
            quantity_remaining: 1,
            lot_type: 'BUY',
            date_created: '2026-08-01T12:00:00.000Z',
            date_updated: null,
          },
        ]),
      },
    };
    const service = new LotService(prisma as any);

    const asc = await service.getAll({
      userId: 'user-1',
      sort: { key: 'quantityRemaining', order: 'asc' },
    });
    const desc = await service.getAll({
      userId: 'user-1',
      sort: { key: 'quantityRemaining', order: 'desc' },
    });

    expect(asc.map((lot) => lot.quantityRemaining)).toEqual([1, 2, 10]);
    expect(desc.map((lot) => lot.quantityRemaining)).toEqual([10, 2, 1]);
  });

  it('filters lots by item id', async () => {
    const prisma = {
      lot: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'lot-1',
            item_id: 'item-1',
            is_active: true,
            price_remaining: 10,
            quantity_exported: 0,
            quantity_remaining: 2,
            lot_type: 'TRADE',
            date_created: '2026-08-01T10:00:00.000Z',
            date_updated: null,
          },
        ]),
      },
    };
    const service = new LotService(prisma as any);

    const lots = await service.getByItemId({ userId: 'user-1', itemId: 'item-1' });

    expect(prisma.lot.findMany).toHaveBeenCalledWith({
      where: {
        user_id: 'user-1',
        item_id: 'item-1',
        is_active: undefined,
      },
    });
    expect(lots).toHaveLength(1);
    expect(lots[0]?.itemId).toBe('item-1');
  });

  it('consumes quantity across lots in order and returns allocations', async () => {
    const prisma = {
      lot: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'lot-1',
            item_id: 'item-1',
            is_active: true,
            price_remaining: 10,
            quantity_exported: 0,
            quantity_remaining: 2,
            lot_type: 'TRADE',
            date_created: '2026-08-01T10:00:00.000Z',
            date_updated: null,
          },
          {
            id: 'lot-2',
            item_id: 'item-1',
            is_active: true,
            price_remaining: 20,
            quantity_exported: 0,
            quantity_remaining: 3,
            lot_type: 'TRADE',
            date_created: '2026-08-01T11:00:00.000Z',
            date_updated: null,
          },
        ]),
        update: vi.fn().mockResolvedValue({ id: 'lot-1' }),
      },
      $transaction: vi.fn(async (callback: (tx: unknown) => unknown) => callback({})),
    };
    const service = new LotService(prisma as any);

    const allocations = await service.consumeQuantityOnLots({
      userId: 'user-1',
      itemId: 'item-1',
      quantity: 4,
    });

    expect(allocations).toEqual([
      { lotId: 'lot-1', quantity: 2 },
      { lotId: 'lot-2', quantity: 2 },
    ]);
    expect(prisma.lot.update).toHaveBeenNthCalledWith(1, {
      where: { id: 'lot-1' },
      data: {
        quantity_remaining: 0,
        is_active: false,
      },
    });
    expect(prisma.lot.update).toHaveBeenNthCalledWith(2, {
      where: { id: 'lot-2' },
      data: {
        quantity_remaining: 1,
        is_active: true,
      },
    });
  });

  it('increments remaining quantity on one lot', async () => {
    const prisma = {
      lot: {
        update: vi.fn().mockResolvedValue({ id: 'lot-1' }),
      },
    };
    const service = new LotService(prisma as any);

    const updated = await service.remainingIncrement({
      userId: 'user-1',
      id: 'lot-1',
      increment: 3,
    });

    expect(updated).toEqual({ id: 'lot-1' });
    expect(prisma.lot.update).toHaveBeenCalledWith({
      where: { user_id: 'user-1', id: 'lot-1' },
      data: expect.objectContaining({
        quantity_remaining: { increment: 3 },
        is_active: true,
      }),
    });
  });

  it('creates one lot', async () => {
    const prisma = {
      lot: {
        create: vi.fn().mockResolvedValue({ id: 'lot-1' }),
      },
    };
    const service = new LotService(prisma as any);

    const created = await service.create({
      userId: 'user-1',
      body: {
        itemId: 'item-1',
        quantityRemaining: 5,
        quantityExported: 0,
        priceRemaining: 15,
        lotType: 'TRADE',
        createdAt: '2026-08-01T10:00:00.000Z',
        isActive: true,
      },
    });

    expect(created).toEqual({ id: 'lot-1' });
    expect(prisma.lot.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        item_id: 'item-1',
        quantity_remaining: 5,
        quantity_exported: 0,
        price_remaining: 15,
        lot_type: 'TRADE',
        is_active: true,
        user_id: 'user-1',
      }),
    });
  });
});
