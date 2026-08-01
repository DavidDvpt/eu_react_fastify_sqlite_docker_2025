/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { describe, expect, it, vi } from 'vitest';

import { ItemService } from '../itemService.js';

describe('ItemService', () => {
  it('creates and reads an item', async () => {
    const itemRow = {
      id: 'item-1',
      name: 'Pikachu',
      image_url_id: 'img-1',
      is_active: true,
      is_limited: true,
      user_id: 'user-1',
      date_created: '2026-08-01T10:00:00.000Z',
      date_updated: null,
      item_type_id: 'type-1',
      value: 1.23,
    };
    const prisma = {
      item: {
        create: vi.fn().mockResolvedValue(itemRow),
        findUnique: vi.fn().mockResolvedValue(itemRow),
      },
    };
    const service = new ItemService(prisma as any);

    const created = await service.create({
      userId: 'user-1',
      body: {
        name: 'Pikachu',
        imageUrlId: 'img-1',
        value: 1.23,
        isLimited: true,
        typeId: 'type-1',
        isActive: true,
      },
    });
    const found = await service.getById({ id: created.id, userId: 'user-1' });

    expect(created).toEqual({ id: 'item-1' });
    expect(found).toEqual({
      id: 'item-1',
      name: 'Pikachu',
      imageUrlId: 'img-1',
      isActive: true,
      isLimited: true,
      userId: 'user-1',
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: null,
      typeId: 'type-1',
      value: 1.23,
    });
  });

  it('updates an item', async () => {
    const prisma = {
      item: {
        update: vi.fn().mockResolvedValue({ id: 'item-1' }),
        findUnique: vi.fn().mockResolvedValue({
          id: 'item-1',
          name: 'Updated Item',
          image_url_id: 'img-1',
          is_active: true,
          is_limited: true,
          user_id: 'user-1',
          date_created: '2026-08-01T10:00:00.000Z',
          date_updated: '2026-08-01T11:00:00.000Z',
          item_type_id: 'type-1',
          value: 1.23,
        }),
      },
    };
    const service = new ItemService(prisma as any);

    const updated = await service.update({
      id: 'item-1',
      userId: 'user-1',
      body: { name: 'Updated Item', typeId: 'type-1' },
    });
    const found = await service.getById({ id: updated.id, userId: 'user-1' });

    expect(updated).toEqual({ id: 'item-1' });
    expect(found?.name).toBe('Updated Item');
  });

  it('lists parsed items for the current user', async () => {
    const prisma = {
      item: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'item-2',
            name: 'Zeta',
            image_url_id: 'img-2',
            is_active: true,
            is_limited: false,
            user_id: 'user-1',
            date_created: '2026-08-01T10:05:00.000Z',
            date_updated: null,
            item_type_id: 'type-1',
            value: 2.34,
          },
          {
            id: 'item-1',
            name: 'Alpha',
            image_url_id: 'img-1',
            is_active: true,
            is_limited: true,
            user_id: 'user-1',
            date_created: '2026-08-01T10:00:00.000Z',
            date_updated: null,
            item_type_id: 'type-1',
            value: 1.23,
          },
        ]),
      },
    };
    const service = new ItemService(prisma as any);

    const all = await service.getAll({
      userId: 'user-1',
      sort: { key: 'name', order: 'asc' },
    });

    expect(prisma.item.findMany).toHaveBeenCalledWith({
      where: {
        user_id: 'user-1',
        item_type_id: undefined,
        is_active: undefined,
      },
    });
    expect(all.map((item) => item.name)).toEqual(['Alpha', 'Zeta']);
    expect(all.every((item) => item.userId === 'user-1')).toBe(true);
  });
});
