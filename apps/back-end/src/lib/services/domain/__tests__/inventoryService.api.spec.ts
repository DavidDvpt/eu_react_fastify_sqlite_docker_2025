/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, expect, it, vi } from 'vitest';

import { InventoryService } from '../inventoryService.js';

describe('InventoryService', () => {
  it('returns active lots sorted by creation date by default', async () => {
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
            lot_type: 'TRADE',
            date_created: '2026-08-01T10:00:00.000Z',
            date_updated: null,
          },
        ]),
      },
    };
    const stockService = {
      getStockFromLots: vi.fn(),
    };
    const service = new InventoryService(prisma as any, stockService as any);

    const lots = await service.getLots({
      userId: 'user-1',
      isActive: true,
      sort: { key: 'createdAt', order: 'asc' },
    });

    expect(prisma.lot.findMany).toHaveBeenCalledWith({
      where: {
        user_id: 'user-1',
        is_active: true,
        item_id: undefined,
      },
    });
    expect(lots).toEqual([
      expect.objectContaining({
        id: 'lot-1',
        itemId: 'item-1',
        quantityRemaining: 3,
      }),
    ]);
  });

  it('aggregates stocks from the lots returned by getLots', async () => {
    const prisma = {};
    const stockService = {
      getStockFromLots: vi.fn().mockReturnValue({ 'item-1': 3 }),
    };
    const service = new InventoryService(prisma as any, stockService as any);
    const getLotsSpy = vi.spyOn(service, 'getLots').mockResolvedValueOnce([
      {
        id: 'lot-1',
        itemId: 'item-1',
        isActive: true,
        priceRemaining: 10,
        quantityExported: 0,
        quantityRemaining: 3,
        lotType: 'TRADE',
        createdAt: '2026-08-01T10:00:00.000Z',
        updatedAt: null,
      },
    ]);

    const stocks = await service.getStocks({
      userId: 'user-1',
      isActive: true,
      sort: { key: 'createdAt', order: 'asc' },
    });

    expect(getLotsSpy).toHaveBeenCalledWith({
      userId: 'user-1',
      isActive: true,
      sort: { key: 'createdAt', order: 'asc' },
    });
    expect(stockService.getStockFromLots).toHaveBeenCalledOnce();
    expect(stocks).toEqual({ 'item-1': 3 });
  });

  it('passes the sorted active lots to StockService', async () => {
    const prisma = {
      lot: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'lot-2',
            item_id: 'item-1',
            is_active: true,
            price_remaining: 20,
            quantity_exported: 0,
            quantity_remaining: 7,
            lot_type: 'TRADE',
            date_created: '2026-08-01T11:00:00.000Z',
            date_updated: null,
          },
          {
            id: 'lot-1',
            item_id: 'item-1',
            is_active: true,
            price_remaining: 10,
            quantity_exported: 0,
            quantity_remaining: 3,
            lot_type: 'TRADE',
            date_created: '2026-08-01T10:00:00.000Z',
            date_updated: null,
          },
        ]),
      },
    };
    const stockService = {
      getStockFromLots: vi.fn().mockReturnValue({ 'item-1': 10 }),
    };
    const service = new InventoryService(prisma as any, stockService as any);

    const stocks = await service.getStocks({
      userId: 'user-1',
      isActive: true,
      sort: { key: 'createdAt', order: 'asc' },
    });

    expect(stockService.getStockFromLots).toHaveBeenCalledWith([
      expect.objectContaining({ id: 'lot-1' }),
      expect.objectContaining({ id: 'lot-2' }),
    ]);
    expect(stocks).toEqual({ 'item-1': 10 });
  });
});
