/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { describe, expect, it, vi } from 'vitest';

import { InventoryService } from '../inventoryService.js';

describe('InventoryService', () => {
  it('returns the stock for one item from active lots only', async () => {
    const prisma = {
      lot: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'lot-1',
            item_id: 'item-1',
            is_active: true,
            price_remaining: 10,
            quantity_exported: 0,
            quantity_remaining: 3,
            lot_type: 'LOT',
            date_created: '2026-08-01T10:00:00.000Z',
            date_updated: null,
          },
          {
            id: 'lot-2',
            item_id: 'item-1',
            is_active: true,
            price_remaining: 20,
            quantity_exported: 0,
            quantity_remaining: 7,
            lot_type: 'TRANSACTION',
            date_created: '2026-08-01T11:00:00.000Z',
            date_updated: null,
          },
        ]),
      },
    };
    const stockService = {
      getStockFromLots: vi.fn().mockReturnValue(10),
      getStocksFromLots: vi.fn(),
    };
    const service = new InventoryService(prisma as any, stockService);

    const stock = await service.getInventoryByItemId({ userId: 'user-1', itemId: 'item-1' });

    expect(prisma.lot.findMany).toHaveBeenCalledWith({
      where: {
        user_id: 'user-1',
        item_id: 'item-1',
        is_active: true,
      },
      orderBy: undefined,
    });
    expect(stockService.getStockFromLots).toHaveBeenCalledOnce();
    expect(stock).toBe(10);
  });

  it('throws when the computed stock is negative', async () => {
    const prisma = {
      lot: {
        findMany: vi.fn().mockResolvedValue([]),
      },
    };
    const stockService = {
      getStockFromLots: vi.fn().mockReturnValue(-1),
    };
    const service = new InventoryService(prisma as any, stockService);

    await expect(
      service.getInventoryByItemId({ userId: 'user-1', itemId: 'item-1' })
    ).rejects.toThrow('Invariant violated: negative stock for item item-1');
  });

  it('returns the aggregated stocks by item using active lots sorted by creation date', async () => {
    const prisma = {
      lot: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'lot-1',
            item_id: 'item-1',
            is_active: true,
            price_remaining: 10,
            quantity_exported: 0,
            quantity_remaining: 3,
            lot_type: 'LOT',
            date_created: '2026-08-01T10:00:00.000Z',
            date_updated: null,
          },
        ]),
      },
    };
    const stockService = {
      getStockFromLots: vi.fn().mockReturnValue({ 'item-1': 3 }),
    };
    const service = new InventoryService(prisma as any, stockService);

    const stocks = await service.getInventory({ userId: 'user-1' });

    expect(prisma.lot.findMany).toHaveBeenCalledWith({
      where: {
        user_id: 'user-1',
        is_active: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    expect(stockService.getStockFromLots).toHaveBeenCalledOnce();
    expect(stocks).toEqual({ 'item-1': 3 });
  });
});
