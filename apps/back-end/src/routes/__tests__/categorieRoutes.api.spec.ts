import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import { errorHandler } from '../../plugins/errorHandler.js';
import { categoryRoutes } from '../categoryRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

const categoryServiceMocks = {
  getAll: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
};

const typeServiceMocks = {
  getAll: vi.fn(),
};

vi.mock('../../lib/services/index.js', () => ({
  CategoryService: vi.fn(function MockCategoryService() {
    return categoryServiceMocks;
  }),
  TypeService: vi.fn(function MockTypeService() {
    return typeServiceMocks;
  }),
}));

describe('categorieRoutes', () => {
  function buildApp(role: 'USER' | 'ADMIN' = 'USER') {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.setErrorHandler(errorHandler);

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

    app.register(categoryRoutes, { prefix: `${API_PREFIX}/categories` });

    return { app };
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/categories returns category list with readable scopes', async () => {
    const { app } = buildApp();
    vi.mocked(categoryServiceMocks.getAll).mockResolvedValueOnce([{ id: 'cat-1', name: 'Material' }] as never);

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/categories` });

    expect(res.statusCode).toBe(200);
    expect(categoryServiceMocks.getAll).toHaveBeenCalledWith({
      isActive: true,
      sort: { key: 'name', order: undefined },
    });
    await app.close();
  });

  it('POST /api/v1/categories creates category for authenticated user', async () => {
    const { app } = buildApp('ADMIN');
    vi.mocked(categoryServiceMocks.create).mockResolvedValueOnce({ id: 'cat-1' } as never);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/categories`,
      payload: { name: 'Custom', isActive: true },
    });

    expect(res.statusCode).toBe(201);
    expect(categoryServiceMocks.create).toHaveBeenCalledWith({
      userId: expect.any(String),
      body: { name: 'Custom', isActive: true },
    });
    expect(res.json()).toEqual({ id: 'cat-1' });
    await app.close();
  });

  it('GET /api/v1/categories/:id returns 404 when not found', async () => {
    const { app } = buildApp();
    vi.mocked(categoryServiceMocks.getById).mockResolvedValueOnce(null as never);

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/categories/cat-x` });

    expect(res.statusCode).toBe(404);
    expect(categoryServiceMocks.getById).toHaveBeenCalledWith({
      id: 'cat-x',
      userIds: [expect.any(String)],
    });
    await app.close();
  });

  it('PATCH /api/v1/categories/:id returns 403 when mutation is forbidden', async () => {
    const { app } = buildApp('ADMIN');
    vi.mocked(categoryServiceMocks.update).mockRejectedValueOnce(
      new Error('Forbidden mutation: only the owner can update this row')
    );

    await app.ready();
    const res = await app.inject({
      method: 'PATCH',
      url: `${API_PREFIX}/categories/cat-1`,
      payload: { name: 'Updated' },
    });

    expect(res.statusCode).toBe(403);
    expect(res.json()).toEqual({ message: 'Forbidden' });
    await app.close();
  });
});
