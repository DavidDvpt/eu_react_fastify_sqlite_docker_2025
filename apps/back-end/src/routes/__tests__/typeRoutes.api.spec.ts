import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import typeRoutes from '../typeRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

const typeServiceMocks = {
  getAll: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
};

const itemServiceMocks = {
  getAll: vi.fn(),
};

vi.mock('../../lib/services/prisma/typeService.js', () => ({
  TypeService: vi.fn(function MockTypeService() {
    return typeServiceMocks;
  }),
}));

vi.mock('../../lib/services/index.js', () => ({
  ItemService: vi.fn(function MockItemService() {
    return itemServiceMocks;
  }),
}));

describe('typeRoutes', () => {
  function buildApp(role: 'USER' | 'ADMIN' = 'USER') {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role, pseudo: 'john' };
      });
    });
    app.decorate('adminProtect', function (this: FastifyInstance) {
      this.addHook('preHandler', async (request, reply) => {
        if (request.user.role !== 'ADMIN') {
          return reply.code(403).send({ message: 'Not authorized' });
        }
      });
    });

    app.register(typeRoutes, { prefix: `${API_PREFIX}/types` });

    return { app };
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/types returns list with readable scopes', async () => {
    const { app } = buildApp();
    vi.mocked(typeServiceMocks.getAll).mockResolvedValueOnce([{ id: 'type-1', name: 'Ore' }] as never);

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/types` });

    expect(res.statusCode).toBe(200);
    expect(typeServiceMocks.getAll).toHaveBeenCalledWith({
      isActive: true,
      categoryId: undefined,
      sort: { key: 'name', order: undefined },
    });
    await app.close();
  });

  it('POST /api/v1/types creates type for authenticated user', async () => {
    const { app } = buildApp('ADMIN');
    vi.mocked(typeServiceMocks.create).mockResolvedValueOnce({ id: 'type-1' } as never);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/types`,
      payload: {
        name: 'Ore',
        categoryId: 'cat-1',
        isActive: true,
        isStackable: false,
      },
    });

    expect(res.statusCode).toBe(201);
    expect(typeServiceMocks.create).toHaveBeenCalledWith({
      userId: expect.any(String),
      body: {
        name: 'Ore',
        categoryId: 'cat-1',
        isActive: true,
        isStackable: false,
      },
    });
    expect(res.json()).toEqual({ id: 'type-1' });
    await app.close();
  });

  it('PATCH /api/v1/types/:id returns 403 when mutation is forbidden', async () => {
    const { app } = buildApp('ADMIN');
    vi.mocked(typeServiceMocks.update).mockRejectedValueOnce(
      new Error('Forbidden mutation: only the owner can update this row')
    );

    await app.ready();
    const res = await app.inject({
      method: 'PATCH',
      url: `${API_PREFIX}/types/type-1`,
      payload: { name: 'Updated Type' },
    });

    expect(res.statusCode).toBe(403);
    expect(res.json()).toEqual({ message: 'Forbidden' });
    await app.close();
  });
});
