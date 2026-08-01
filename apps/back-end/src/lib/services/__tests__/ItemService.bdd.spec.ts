import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import prismaClient from '../../../../prisma/prismaClient.js';
import { ItemService } from '../itemService.js';

import { categoryMock, itemMock, typeMock } from './mock.js';

const prisma = prismaClient;
const service = new ItemService(prismaClient);
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

describe('ItemService', () => {
  async function createTypeId() {
    const category = await prisma.category.create({
      data: categoryMock(DEFAULT_OWNER_ID)[0],
    });
    const type = await prisma.type.create({
      data: typeMock(category.id, DEFAULT_OWNER_ID)[0],
    });

    return type.id;
  }

  it('creates and reads an item', async () => {
    const typeId = await createTypeId();
    const payload = itemMock(typeId, DEFAULT_OWNER_ID)[0];
    const created = await service.create({
      userId: DEFAULT_OWNER_ID,
      body: {
        name: payload.name,
        imageUrlId: payload.image_url_id,
        value: payload.value,
        isLimited: payload.is_limited,
        typeId,
        isActive: payload.is_active,
      },
    });
    const found = await service.getById({ id: created.id, userId: DEFAULT_OWNER_ID });

    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe(payload.name);
    expect(found?.typeId).toBe(typeId);
  });

  it('updates an item', async () => {
    const typeId = await createTypeId();
    const payload = itemMock(typeId, DEFAULT_OWNER_ID)[0];
    const created = await service.create({
      userId: DEFAULT_OWNER_ID,
      body: {
        name: payload.name,
        imageUrlId: payload.image_url_id,
        value: payload.value,
        isLimited: payload.is_limited,
        typeId,
        isActive: payload.is_active,
      },
    });
    const updated = await service.update({
      id: created.id,
      userId: DEFAULT_OWNER_ID,
      body: { name: 'Updated Item', typeId },
    });
    const found = await service.getById({ id: updated.id, userId: DEFAULT_OWNER_ID });

    expect(found?.id).toBe(updated.id);
    expect(found?.name).toBe('Updated Item');
  });

  it('lists items for the current user', async () => {
    const typeId = await createTypeId();
    const payloads = itemMock(typeId, DEFAULT_OWNER_ID);

    await service.create({
      userId: DEFAULT_OWNER_ID,
      body: {
        name: payloads[0].name,
        imageUrlId: payloads[0].image_url_id,
        value: payloads[0].value,
        isLimited: payloads[0].is_limited,
        typeId,
        isActive: payloads[0].is_active,
      },
    });
    await service.create({
      userId: DEFAULT_OWNER_ID,
      body: {
        name: payloads[1].name,
        imageUrlId: payloads[1].image_url_id,
        value: payloads[1].value,
        isLimited: payloads[1].is_limited,
        typeId,
        isActive: payloads[1].is_active,
      },
    });

    const all = await service.getAll({ userId: DEFAULT_OWNER_ID });

    expect(all.length).toBeGreaterThanOrEqual(2);
    expect(all.every((item) => item.user_id === DEFAULT_OWNER_ID)).toBe(true);
  });
});
