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
        findUnique: vi.fn().mockResolvedValue(categoryRow),
      },
    };
    const service = new CategoryService(prisma as any);

    const created = await service.create({
      userId: 'user-1',
      body: { name: 'Materials', is_active: true },
    });
    const found = await service.getById({ id: created.id, userId: 'user-1' });

    expect(created).toEqual({ id: 'category-1' });
    expect(found).toEqual({
      id: 'category-1',
      name: 'Materials',
      isActive: true,
      userId: 'user-1',
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: undefined,
    });
  });

  it('updates a category', async () => {
    const prisma = {
      category: {
        update: vi.fn().mockResolvedValue({ id: 'category-1' }),
        findUnique: vi.fn().mockResolvedValue({
          id: 'category-1',
          name: 'Updated Category',
          is_active: true,
          user_id: 'user-1',
          date_created: '2026-08-01T10:00:00.000Z',
          date_updated: '2026-08-01T11:00:00.000Z',
        }),
      },
    };
    const service = new CategoryService(prisma as any);

    const updated = await service.update({
      id: 'category-1',
      userId: 'user-1',
      body: { name: 'Updated Category' },
    });
    const found = await service.getById({ id: updated.id, userId: 'user-1' });

    expect(updated).toEqual({ id: 'category-1' });
    expect(found?.name).toBe('Updated Category');
  });

  it('lists parsed categories for the current user', async () => {
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

    const all = await service.getAll({ userId: 'user-1' });

    expect(prisma.category.findMany).toHaveBeenCalledWith({
      where: { user_id: 'user-1', is_active: undefined },
    });
    expect(all.map((category) => category.name)).toEqual(['Alpha', 'Zeta']);
    expect(all.every((category) => category.userId === 'user-1')).toBe(true);
  });
});
