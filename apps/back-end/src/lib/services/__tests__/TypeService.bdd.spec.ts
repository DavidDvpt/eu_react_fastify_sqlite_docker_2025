import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import prismaClient from '../../../../prisma/prismaClient.js';
import { TypeService } from '../typeService.js';

import { categoryMock, typeMock } from './mock.js';

const prisma = prismaClient;
const categoryServiceOwnerId = '0FB0E33F-424C-4A2A-A135-FFF8A2D81E5E';
const service = new TypeService(prismaClient);

beforeAll(async () => {
  await prisma.user.createMany({
    data: [
      {
        id: categoryServiceOwnerId,
        firstname: 'BDD',
        lastname: 'Owner',
        pseudo: `bdd-owner-${categoryServiceOwnerId.toLowerCase()}`,
        email: `bdd-owner-${categoryServiceOwnerId.toLowerCase()}@test.local`,
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

describe('TypeService', () => {
  async function createCategoryId() {
    const category = await prisma.category.create({
      data: categoryMock(categoryServiceOwnerId)[0],
    });

    return category.id;
  }

  it('creates and reads a type', async () => {
    const categoryId = await createCategoryId();
    const payload = typeMock(categoryId, categoryServiceOwnerId)[0];
    const created = await service.create({
      userId: categoryServiceOwnerId,
      body: {
        name: payload.name,
        categoryId,
        isStackable: false,
      },
    });
    const found = await service.getById({ id: created.id, userId: categoryServiceOwnerId });

    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe(payload.name);
    expect(found?.categoryId).toBe(categoryId);
  });

  it('updates a type', async () => {
    const categoryId = await createCategoryId();
    const payload = typeMock(categoryId, categoryServiceOwnerId)[0];
    const created = await service.create({
      userId: categoryServiceOwnerId,
      body: {
        name: payload.name,
        categoryId,
        isStackable: false,
      },
    });
    const updated = await service.update({
      id: created.id,
      userId: categoryServiceOwnerId,
      body: { name: 'Updated Type', categoryId, isStackable: true },
    });
    const found = await service.getById({ id: updated?.id ?? '', userId: categoryServiceOwnerId });

    expect(found?.id).toBe(updated?.id);
    expect(found?.name).toBe('Updated Type');
  });

  it('lists types for the current user', async () => {
    const categoryId = await createCategoryId();
    const payloads = typeMock(categoryId, categoryServiceOwnerId);

    await service.create({
      userId: categoryServiceOwnerId,
      body: { name: payloads[0].name, categoryId, isStackable: false },
    });
    await service.create({
      userId: categoryServiceOwnerId,
      body: { name: payloads[1].name, categoryId, isStackable: true },
    });

    const all = await service.getAll({ userId: categoryServiceOwnerId });

    expect(all.length).toBeGreaterThanOrEqual(2);
    expect(all.every((type) => type.user_id === categoryServiceOwnerId)).toBe(true);
  });
});
