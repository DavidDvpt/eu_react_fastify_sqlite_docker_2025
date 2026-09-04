/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, expect, it, vi } from 'vitest';

import { NexusService } from '../NexusService.js';

describe('NexusService', () => {
  it('groups item and missing-image counts by app type', async () => {
    const prisma = {
      type: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'type-1',
            name: 'Finders',
            category_id: 'category-1',
            is_stackable: false,
            is_active: true,
            user_id: 'user-1',
            date_created: '2026-09-01T00:00:00.000Z',
            date_updated: null,
          },
          {
            id: 'type-2',
            name: 'Refiners',
            category_id: 'category-1',
            is_stackable: false,
            is_active: true,
            user_id: 'user-1',
            date_created: '2026-09-01T00:00:00.000Z',
            date_updated: null,
          },
        ]),
      },
      item: {
        groupBy: vi
          .fn()
          .mockResolvedValueOnce([
            { type_id: 'type-1', _count: { _all: 4 } },
            { type_id: 'type-2', _count: { _all: 1 } },
          ])
          .mockResolvedValueOnce([{ type_id: 'type-1', _count: { _all: 2 } }]),
      },
    };
    const service = new NexusService(prisma as any);

    const counts = await service.getCounts();

    expect(counts).toEqual({
      Finders: { itemCount: 4, itemCountWithoutImage: 2 },
      Refiners: { itemCount: 1, itemCountWithoutImage: 0 },
    });
  });

  it('updates Nexus item counts when they are supplied', async () => {
    const prisma = {
      nexusUpdate: {
        update: vi.fn().mockResolvedValue({
          id: 'type-1',
          nexus_request_type: 'Finders',
          nexus_name: 'Finders',
          item_count: 4,
          image_missing_count: 2,
          change_count: 0,
          created_at: '2026-09-01T00:00:00.000Z',
          inserted_at: null,
          updated_at: '2026-09-01T01:00:00.000Z',
          type: { id: 'type-1', name: 'Finders' },
        }),
      },
    };
    const service = new NexusService(prisma as any);

    await service.update({
      id: 'type-1',
      body: {
        appTypeName: 'Finders',
        nexusName: 'Finders',
        nexusRequestType: 'Finders',
      },
      counts: { itemCount: 4, itemCountWithoutImage: 2 },
    });

    expect(prisma.nexusUpdate.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'type-1' },
        data: expect.objectContaining({
          item_count: 4,
          image_missing_count: 2,
        }),
      })
    );
  });
});
