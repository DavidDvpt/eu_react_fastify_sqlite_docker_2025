/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { describe, expect, it, vi } from 'vitest';

import { TypeService } from '../typeService.js';

describe('TypeService', () => {
  it('creates and reads a type', async () => {
    const typeRow = {
      id: 'type-1',
      name: 'Booster',
      category_id: 'category-1',
      is_stackable: false,
      is_active: true,
      user_id: 'user-1',
      date_created: '2026-08-01T10:00:00.000Z',
      date_updated: null,
    };
    const prisma = {
      type: {
        create: vi.fn().mockResolvedValue(typeRow),
        findFirst: vi.fn().mockResolvedValue(typeRow),
      },
    };
    const service = new TypeService(prisma as any);

    const created = await service.create({
      userId: 'user-1',
      body: {
        name: 'Booster',
        categoryId: 'category-1',
        isStackable: false,
      },
    });
    const found = await service.getById({ id: created.id, userIds: ['user-1'] });

    expect(created).toEqual({ id: 'type-1' });
    expect(found).toEqual({
      id: 'type-1',
      name: 'Booster',
      categoryId: 'category-1',
      isStackable: false,
      isActive: true,
      userId: 'user-1',
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: null,
    });
  });

  it('updates a type', async () => {
    const prisma = {
      type: {
        update: vi.fn().mockResolvedValue({ id: 'type-1' }),
        findFirst: vi.fn().mockResolvedValue({
          id: 'type-1',
          name: 'Updated Type',
          category_id: 'category-1',
          is_stackable: true,
          is_active: true,
          user_id: 'user-1',
          date_created: '2026-08-01T10:00:00.000Z',
          date_updated: '2026-08-01T11:00:00.000Z',
        }),
      },
    };
    const service = new TypeService(prisma as any);

    const updated = await service.update({
      id: 'type-1',
      userId: 'user-1',
      body: { name: 'Updated Type', categoryId: 'category-1', isStackable: true },
    });
    const found = await service.getById({ id: updated?.id ?? '', userIds: ['user-1'] });

    expect(updated).toEqual({ id: 'type-1' });
    expect(found?.name).toBe('Updated Type');
  });

  it('lists parsed types', async () => {
    const prisma = {
      type: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'type-2',
            name: 'Zeta',
            category_id: 'category-1',
            is_stackable: false,
            is_active: true,
            user_id: 'user-1',
            date_created: '2026-08-01T10:05:00.000Z',
            date_updated: null,
          },
          {
            id: 'type-1',
            name: 'Alpha',
            category_id: 'category-1',
            is_stackable: true,
            is_active: true,
            user_id: 'user-1',
            date_created: '2026-08-01T10:00:00.000Z',
            date_updated: null,
          },
        ]),
      },
    };
    const service = new TypeService(prisma as any);

    const all = await service.getAll({});

    expect(prisma.type.findMany).toHaveBeenCalledWith({
      where: {
        is_active: undefined,
        category_id: undefined,
      },
    });
    expect(all.map((type) => type.name)).toEqual(['Alpha', 'Zeta']);
    expect(all.every((type) => type.userId === 'user-1')).toBe(true);
  });
});
