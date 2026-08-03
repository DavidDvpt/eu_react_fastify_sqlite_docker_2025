/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi } from 'vitest';

import { LotService } from '../lotService.js';

describe('LotService', () => {
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
});
