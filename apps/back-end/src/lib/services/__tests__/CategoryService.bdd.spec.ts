import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import prismaClient from '../../../../prisma/prismaClient.js';
import { CategoryService } from '../categoryService.js';

import { categoryMock } from './mock.js';

const prisma = prismaClient;
const service = new CategoryService(prismaClient);
const DEFAULT_OWNER_ID = '0FB0E33F-424C-4A2A-A135-FFF8A2D81E5E';

beforeAll(async () => {
  await prisma.user.createMany({
    data: [
      {
        id: DEFAULT_OWNER_ID,
        firstname: 'BDD',
        lastname: 'Owner',
        pseudo: `bdd-owner-${DEFAULT_OWNER_ID.toLowerCase()}`,
        email: `bdd-owner-${DEFAULT_OWNER_ID.toLowerCase()}@test.local`,
        password_hash: 'hashed',
        role: 'USER',
        date_created: new Date().toISOString(),
        date_updated: null,
        is_active: true,
      },
    ],
    skipDuplicates: true,
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('CategoryService', () => {
  it('creates and reads a category', async () => {
    const payload = categoryMock(DEFAULT_OWNER_ID)[0];
    const created = await service.create({
      userId: DEFAULT_OWNER_ID,
      body: { name: payload.name, is_active: payload.is_active },
    });
    const found = await service.getById({ id: created.id, userId: DEFAULT_OWNER_ID });

    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe(payload.name);
    expect(found?.userId).toBe(DEFAULT_OWNER_ID);
  });

  it('updates a category', async () => {
    const payload = categoryMock(DEFAULT_OWNER_ID)[0];
    const created = await service.create({
      userId: DEFAULT_OWNER_ID,
      body: { name: payload.name, is_active: payload.is_active },
    });
    const updated = await service.update({
      id: created.id,
      userId: DEFAULT_OWNER_ID,
      body: { name: 'Updated Category' },
    });
    const found = await service.getById({ id: updated.id, userId: DEFAULT_OWNER_ID });

    expect(found?.id).toBe(updated.id);
    expect(found?.name).toBe('Updated Category');
  });

  it('lists categories for the current user', async () => {
    const payloads = categoryMock(DEFAULT_OWNER_ID);

    await service.create({
      userId: DEFAULT_OWNER_ID,
      body: { name: payloads[0].name, is_active: payloads[0].is_active },
    });
    await service.create({
      userId: DEFAULT_OWNER_ID,
      body: { name: payloads[1].name, is_active: payloads[1].is_active },
    });

    const all = await service.getAll({ userId: DEFAULT_OWNER_ID });

    expect(all.length).toBeGreaterThanOrEqual(2);
    expect(all.every((category) => category.userId === DEFAULT_OWNER_ID)).toBe(true);
  });
});
