import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import categorieRoutes from '../categoryRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

describe('categorieRoutes', () => {
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
      users,
      types,
      items,
      lotStock,
      transaction,
    });

    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role: 'USER', pseudo: 'john' };
      });
    });
    app.protect();

    app.register(categorieRoutes, { prefix: `${API_PREFIX}/categories` });

    return { app, categories };
  }

  it('GET /api/v1/categories returns category list with user scope', async () => {
    const { app, categories } = buildApp();
    vi.mocked(categories.findMany).mockResolvedValueOnce([{ id: 'cat-1', name: 'Material' }]);

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/categories` });

    expect(res.statusCode).toBe(200);
    expect(categories.findMany).toHaveBeenCalledWith(undefined, 'user-1');
    await app.close();
  });

  it('POST /api/v1/categories creates category for authenticated user', async () => {
    const { app, categories } = buildApp();
    vi.mocked(categories.create).mockResolvedValueOnce({ id: 'cat-1', name: 'Custom' });

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/categories`,
      payload: { name: 'Custom' },
    });

    expect(res.statusCode).toBe(201);
    const createCall = vi.mocked(categories.create).mock.calls[0]?.[0] as {
      data: { name: string; user_id: string };
    };
    expect(createCall.data).toMatchObject({ name: 'Custom', user_id: 'user-1' });
    await app.close();
  });

  it('GET /api/v1/categories/:id returns 404 when not found', async () => {
    const { app, categories } = buildApp();
    vi.mocked(categories.findUnique).mockResolvedValueOnce(null);

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/categories/cat-x` });

    expect(res.statusCode).toBe(404);
    expect(categories.findUnique).toHaveBeenCalledWith({ where: { id: 'cat-x' } }, 'user-1');
    await app.close();
  });

  it('PUT /api/v1/categories/:id/edit returns 403 when mutation is forbidden', async () => {
    const { app, categories } = buildApp();
    vi.mocked(categories.update).mockRejectedValueOnce(
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
});
