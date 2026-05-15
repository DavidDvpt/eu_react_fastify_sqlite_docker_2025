import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../../config/routes.js';
import typeRoutes from '../typeRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

describe('typeRoutes', () => {
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
    const sessionStats = { getSellSessions: vi.fn() };
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
      categories,
      types,
      items,
      lotStock,
      sessionStats,
    } as unknown as FastifyInstance['repos']);

    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role: 'USER', pseudo: 'john' };
      });
    });
    app.protect();

    app.register(typeRoutes, { prefix: `${API_PREFIX}/types` });

    return { app, types };
  }

  it('GET /api/v1/types returns list with user scope', async () => {
    const { app, types } = buildApp();
    vi.mocked(types.findMany).mockResolvedValueOnce([{ id: 'type-1', name: 'Ore' }]);

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/types` });

    expect(res.statusCode).toBe(200);
    expect(types.findMany).toHaveBeenCalledWith(undefined, 'user-1');
    await app.close();
  });

  it('POST /api/v1/types creates type for authenticated user', async () => {
    const { app, types } = buildApp();
    vi.mocked(types.create).mockResolvedValueOnce({ id: 'type-1' });

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/types`,
      payload: { name: 'Ore', category_id: 'cat-1' },
    });

    expect(res.statusCode).toBe(201);
    const createCall = vi.mocked(types.create).mock.calls[0]?.[0] as {
      data: { category_id: string; user_id: string };
    };
    expect(createCall.data).toMatchObject({ category_id: 'cat-1', user_id: 'user-1' });
    await app.close();
  });

  it('PUT /api/v1/types/:id/edit returns 403 when mutation is forbidden', async () => {
    const { app, types } = buildApp();
    vi.mocked(types.update).mockRejectedValueOnce(
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
});
