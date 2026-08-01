/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { describe, expect, it, vi } from 'vitest';

import { UserService } from '../userService.js';

describe('UserService', () => {
  it('creates and reads a user by email and pseudo', async () => {
    const userRow = {
      id: 'user-1',
      firstname: 'John',
      lastname: 'Doe',
      pseudo: 'john-doe',
      email: 'john@test.local',
      password_hash: 'hashed',
      role: 'USER',
      date_created: '2026-08-01T10:00:00.000Z',
      date_updated: null,
      is_active: true,
    };
    const prisma = {
      user: {
        create: vi.fn().mockResolvedValue(userRow),
        findUnique: vi.fn().mockResolvedValueOnce(userRow).mockResolvedValueOnce(userRow),
      },
    };
    const service = new UserService(prisma as any);

    const created = await service.create({
      body: {
        firstname: 'John',
        lastname: 'Doe',
        pseudo: 'john-doe',
        email: 'john@test.local',
        password: 'hashed',
      },
    });
    const foundByEmail = await service.getByEmail({ email: 'john@test.local' });
    const foundByPseudo = await service.getByPseudo({ pseudo: 'john-doe' });

    expect(created).toEqual({ id: 'user-1' });
    expect(foundByEmail?.id).toBe('user-1');
    expect(foundByPseudo?.id).toBe('user-1');
    expect(foundByEmail?.email).toBe('john@test.local');
  });

  it('updates a user', async () => {
    const prisma = {
      user: {
        create: vi.fn().mockResolvedValue({ id: 'user-1' }),
        update: vi.fn().mockResolvedValue({ id: 'user-1' }),
        findUnique: vi.fn().mockResolvedValue({
          id: 'user-1',
          firstname: 'Marie',
          lastname: 'Updated',
          pseudo: 'marie',
          email: 'marie@test.local',
          password_hash: 'hashed',
          role: 'USER',
          date_created: '2026-08-01T10:00:00.000Z',
          date_updated: '2026-08-01T11:00:00.000Z',
          is_active: true,
        }),
      },
    };
    const service = new UserService(prisma as any);

    await service.update({
      id: 'user-1',
      body: {
        firstname: 'Marie',
        lastname: 'Updated',
        pseudo: 'marie',
        email: 'marie@test.local',
        isActive: true,
        role: 'USER',
        createdAt: '2026-08-01T10:00:00.000Z',
        updatedAt: undefined,
      },
    });
    const found = await service.getByEmail({ email: 'marie@test.local' });

    expect(found?.id).toBe('user-1');
    expect(found?.lastname).toBe('Updated');
  });
});
