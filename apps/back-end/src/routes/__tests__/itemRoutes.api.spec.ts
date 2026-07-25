import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import itemRoutes from '../itemRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

describe('itemRoutes', () => {
  function buildApp() {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    const categories = {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };
    const types = {
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
    const lotStock = { getStock: vi.fn(), getStockByItemId: vi.fn() };
    const transaction = {};
    const users = {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findFirst: vi.fn(),
    };

    app.decorate('repos', {
      lotStock,
      transaction,
    } as unknown as FastifyInstance['repos']);

    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role: 'USER', pseudo: 'john' };
      });
    });
    app.protect();

    app.register(itemRoutes, { prefix: `${API_PREFIX}/items` });

    return { app, items };
  }

  it('GET /api/v1/items returns list with user scope', async () => {
    const { app, items } = buildApp();
    vi.mocked(items.findMany).mockResolvedValueOnce([{ id: 'item-1', name: 'Oil' }]);

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/items` });

    expect(res.statusCode).toBe(200);
    expect(items.findMany).toHaveBeenCalledWith(undefined, 'user-1');
    await app.close();
  });

  it('POST /api/v1/items creates item for authenticated user', async () => {
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
