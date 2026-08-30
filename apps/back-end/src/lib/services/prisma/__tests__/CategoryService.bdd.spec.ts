/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { describe, expect, it, vi } from 'vitest';

import { CategoryService } from '../categoryService.js';

describe('CategoryService', () => {
  it('creates and reads a category', async () => {
    const categoryRow = {
      id: 'category-1',
      name: 'Materials',
      is_active: true,
      user_id: 'user-1',
      date_created: '2026-08-01T10:00:00.000Z',
      date_updated: null,
    };
    const prisma = {
      category: {
        create: vi.fn().mockResolvedValue(categoryRow),
        findFirst: vi.fn().mockResolvedValue(categoryRow),
      },
    };
    const service = new CategoryService(prisma as any);

    const created = await service.create({
      userId: 'user-1',
      body: { name: 'Materials', isActive: true },
    });
    const found = await service.getById({ id: created.id, userIds: ['user-1'] });

    expect(created).toEqual({ id: 'category-1' });
    expect(found).toEqual({
      id: 'category-1',
      name: 'Materials',
      isActive: true,
      userId: 'user-1',
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: null,
    });
  });

  it('updates a category', async () => {
    const update = vi.fn().mockResolvedValue({ id: 'category-1' });
    const findFirst = vi
      .fn()
      .mockResolvedValueOnce({
        id: 'category-1',
        name: 'Original Category',
        is_active: true,
        user_id: 'user-1',
        date_created: '2026-08-01T10:00:00.000Z',
        date_updated: null,
      })
      .mockResolvedValueOnce({
        id: 'category-1',
        name: 'Updated Category',
        is_active: false,
        user_id: 'user-1',
        date_created: '2026-08-01T10:00:00.000Z',
        date_updated: '2026-08-01T11:00:00.000Z',
      });
    const prisma = {
      category: {
        update,
        findFirst,
      },
    };
    const service = new CategoryService(prisma as any);

    const updated = await service.update({
      id: 'category-1',
      userId: 'user-1',
      body: { name: 'Updated Category', isActive: false },
    });
    const found = await service.getById({ id: updated.id, userIds: ['user-1'] });

    expect(updated).toEqual({ id: 'category-1' });
    expect(update).toHaveBeenCalledWith({
      where: { id: 'category-1' },
      data: {
        name: 'Updated Category',
        is_active: false,
        date_updated: expect.any(String),
      },
    });
    expect(found?.name).toBe('Updated Category');
    expect(found?.isActive).toBe(false);
  });

  it('rejects category update when user does not own the row', async () => {
    const prisma = {
      category: {
        update: vi.fn(),
        findFirst: vi.fn().mockResolvedValue({
          id: 'category-1',
          name: 'Original Category',
          is_active: true,
          user_id: 'user-2',
          date_created: '2026-08-01T10:00:00.000Z',
          date_updated: null,
        }),
      },
    };
    const service = new CategoryService(prisma as any);

    await expect(
      service.update({
        id: 'category-1',
        userId: 'user-1',
        body: { name: 'Updated Category' },
      }),
    ).rejects.toThrow('Forbidden mutation: only the owner can update this row');

    expect(prisma.category.update).not.toHaveBeenCalled();
  });

  it('lists parsed categories', async () => {
    const prisma = {
      category: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'category-2',
            name: 'Zeta',
            is_active: true,
            user_id: 'user-1',
            date_created: '2026-08-01T10:05:00.000Z',
            date_updated: null,
          },
          {
            id: 'category-1',
            name: 'Alpha',
            is_active: true,
            user_id: 'user-1',
            date_created: '2026-08-01T10:00:00.000Z',
            date_updated: null,
          },
        ]),
      },
    };
    const service = new CategoryService(prisma as any);

    const all = await service.getAll({});

    expect(prisma.category.findMany).toHaveBeenCalledWith({
      where: { is_active: undefined },
    });
    expect(all.map((category) => category.name)).toEqual(['Alpha', 'Zeta']);
    expect(all.every((category) => category.userId === 'user-1')).toBe(true);
  });
});
