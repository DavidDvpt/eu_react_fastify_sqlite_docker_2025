import { describe, expect, it } from 'vitest';

import { StockService } from '../stockService.js';

describe('StockService', () => {
  it('sums remaining quantities for a single item lot list', () => {
    const service = new StockService();

    const stock = service.getStockFromLots([
      {
        id: 'lot-1',
        itemId: 'item-1',
        isActive: true,
        priceRemaining: 10,
        quantityExported: 0,
        quantityRemaining: 3,
        lotType: 'LOT',
        createdAt: '2026-08-01T10:00:00.000Z',
      },
      {
        id: 'lot-2',
        itemId: 'item-1',
        isActive: true,
        priceRemaining: 20,
        quantityExported: 0,
        quantityRemaining: 7,
        lotType: 'TRANSACTION',
        createdAt: '2026-08-01T11:00:00.000Z',
      },
    ]);

    expect(stock).toEqual({
      'item-1': 10,
    });
  });

  it('aggregates remaining quantities by item id', () => {
    const service = new StockService();

    const stocks = service.getStockFromLots([
      {
        id: 'lot-1',
        itemId: 'item-1',
        isActive: true,
        priceRemaining: 10,
        quantityExported: 0,
        quantityRemaining: 3,
        lotType: 'LOT',
        createdAt: '2026-08-01T10:00:00.000Z',
      },
      {
        id: 'lot-2',
        itemId: 'item-2',
        isActive: true,
        priceRemaining: 20,
        quantityExported: 0,
        quantityRemaining: 4,
        lotType: 'TRANSACTION',
        createdAt: '2026-08-01T11:00:00.000Z',
      },
      {
        id: 'lot-3',
        itemId: 'item-1',
        isActive: true,
        priceRemaining: 5,
        quantityExported: 0,
        quantityRemaining: 2,
        lotType: 'LOT',
        createdAt: '2026-08-01T12:00:00.000Z',
      },
    ]);

    expect(stocks).toEqual({
      'item-1': 5,
      'item-2': 4,
    });
  });
});
