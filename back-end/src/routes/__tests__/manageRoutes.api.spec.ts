import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import manageRoutes from '../manageRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

describe('manageRoutes', () => {
  function buildApp() {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    const itemCategories = {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };
    const itemTypes = {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };
    const items = {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };
    const lotStats = { getStock: vi.fn(), getStockByItemId: vi.fn() };
    const sessionStats = { getSellSessions: vi.fn() };
    const images = { getImageBufferById: vi.fn() };

    app.decorate('repos', {
      images,
      itemCategories,
      itemTypes,
      items,
      lotStats,
      sessionStats,
    } as unknown as FastifyInstance['repos']);
    app.decorate('protect', function (this: FastifyInstance) {
      this.addHook('preHandler', (request) => {
        request.user = { id: 'user-1', role: 'USER', pseudo: 'john' };
      });
    });

    app.register(manageRoutes, { prefix: API_PREFIX });

    return { app, itemCategories, itemTypes, items, lotStats, sessionStats, images };
  }

  it('GET /api/v1/categories returns category list with readScope user context', async () => {
    const { app, itemCategories } = buildApp();
    vi.mocked(itemCategories.findMany).mockResolvedValueOnce([{ id: 'cat-1', name: 'Material' }]);

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/categories` });

    expect(res.statusCode).toBe(200);
    expect(itemCategories.findMany).toHaveBeenCalledWith(undefined, 'user-1');
    await app.close();
  });

  it('POST /api/v1/categories creates custom category for authenticated user', async () => {
    const { app, itemCategories } = buildApp();
    vi.mocked(itemCategories.create).mockResolvedValueOnce({ id: 'cat-1', name: 'Custom' });

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/categories`,
      payload: { name: 'Custom' },
    });

    expect(res.statusCode).toBe(201);
    const createCall = vi.mocked(itemCategories.create).mock.calls[0]?.[0] as {
      data: { name: string; user_id: string };
    };
    expect(createCall.data).toMatchObject({ name: 'Custom', user_id: 'user-1' });
    await app.close();
  });

  it('GET /api/v1/categories/:id returns 404 when not found with readScope', async () => {
    const { app, itemCategories } = buildApp();
    vi.mocked(itemCategories.findUnique).mockResolvedValueOnce(null);

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/categories/cat-x` });

    expect(res.statusCode).toBe(404);
    expect(itemCategories.findUnique).toHaveBeenCalledWith({ where: { id: 'cat-x' } }, 'user-1');
    await app.close();
  });

  it('PUT /api/v1/categories/:id/edit returns 403 when mutation is forbidden', async () => {
    const { app, itemCategories } = buildApp();
    vi.mocked(itemCategories.update).mockRejectedValueOnce(
      new Error('Forbidden mutation: only the owner can update this row')
    );

    await app.ready();
    const res = await app.inject({
      method: 'PUT',
      url: `${API_PREFIX}/categories/cat-1/edit`,
      payload: { name: 'Updated' },
    });

    expect(res.statusCode).toBe(403);
    await app.close();
  });

  it('GET /api/v1/types returns list with readScope user context', async () => {
    const { app, itemTypes } = buildApp();
    vi.mocked(itemTypes.findMany).mockResolvedValueOnce([{ id: 'type-1', name: 'Ore' }]);

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/types` });

    expect(res.statusCode).toBe(200);
    expect(itemTypes.findMany).toHaveBeenCalledWith(undefined, 'user-1');
    await app.close();
  });

  it('POST /api/v1/types creates custom type for authenticated user', async () => {
    const { app, itemTypes } = buildApp();
    vi.mocked(itemTypes.create).mockResolvedValueOnce({ id: 'type-1' });

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/types`,
      payload: { name: 'Ore', category_id: 'cat-1' },
    });

    expect(res.statusCode).toBe(201);
    const createCall = vi.mocked(itemTypes.create).mock.calls[0]?.[0] as {
      data: { category_id: string; user_id: string };
    };
    expect(createCall.data).toMatchObject({ category_id: 'cat-1', user_id: 'user-1' });
    await app.close();
  });

  it('PUT /api/v1/types/:id/edit returns 403 when mutation is forbidden', async () => {
    const { app, itemTypes } = buildApp();
    vi.mocked(itemTypes.update).mockRejectedValueOnce(
      new Error('Forbidden mutation: only the owner can update this row')
    );

    await app.ready();
    const res = await app.inject({
      method: 'PUT',
      url: `${API_PREFIX}/types/type-1/edit`,
      payload: { name: 'Updated Type' },
    });

    expect(res.statusCode).toBe(403);
    await app.close();
  });

  it('GET /api/v1/items returns list with readScope user context', async () => {
    const { app, items } = buildApp();
    vi.mocked(items.findMany).mockResolvedValueOnce([{ id: 'item-1', name: 'Oil' }]);

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/items` });

    expect(res.statusCode).toBe(200);
    expect(items.findMany).toHaveBeenCalledWith(undefined, 'user-1');
    await app.close();
  });

  it('POST /api/v1/items creates custom item for authenticated user', async () => {
    const { app, items } = buildApp();
    vi.mocked(items.create).mockResolvedValueOnce({ id: 'item-1' });

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/items`,
      payload: {
        name: 'Oil',
        image_url_id: 'img-1',
        value: 10,
        is_limited: false,
        item_type_id: 'type-1',
      },
    });

    expect(res.statusCode).toBe(201);
    const createCall = vi.mocked(items.create).mock.calls[0]?.[0] as {
      data: { item_type_id: string; user_id: string };
    };
    expect(createCall.data).toMatchObject({ item_type_id: 'type-1', user_id: 'user-1' });
    await app.close();
  });

  it('PUT /api/v1/items/:id/edit returns 403 when mutation is forbidden', async () => {
    const { app, items } = buildApp();
    vi.mocked(items.update).mockRejectedValueOnce(
      new Error('Forbidden mutation: only the owner can update this row')
    );

    await app.ready();
    const res = await app.inject({
      method: 'PUT',
      url: `${API_PREFIX}/items/item-1/edit`,
      payload: { name: 'Updated Item' },
    });

    expect(res.statusCode).toBe(403);
    await app.close();
  });
});
