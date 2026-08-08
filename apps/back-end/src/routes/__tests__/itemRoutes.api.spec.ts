import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import itemRoutes from '../itemRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

const itemServiceMocks = {
  getAll: vi.fn(),
  getStock: vi.fn(),
  getLots: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
};

const transactionServiceMocks = {
  getAll: vi.fn(),
};

vi.mock('../../lib/services/index.js', () => ({
  ItemService: vi.fn(function MockItemService() {
    return itemServiceMocks;
  }),
  TransactionService: vi.fn(function MockTransactionService() {
    return transactionServiceMocks;
  }),
}));

describe('itemRoutes', () => {
  function buildApp() {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role: 'USER', pseudo: 'john' };
      });
    });

    app.register(itemRoutes, { prefix: `${API_PREFIX}/items` });

    return { app };
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/items returns list with readable scopes', async () => {
    const { app } = buildApp();
    vi.mocked(itemServiceMocks.getAll).mockResolvedValueOnce([{ id: 'item-1', name: 'Oil' }] as never);

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/items` });

    expect(res.statusCode).toBe(200);
    expect(itemServiceMocks.getAll).toHaveBeenCalledWith({
      userIds: ['user-1', expect.any(String)],
      isActive: undefined,
      typeId: undefined,
      sort: { key: 'name', order: undefined },
    });
    await app.close();
  });

  it('POST /api/v1/items creates item for authenticated user', async () => {
    const { app } = buildApp();
    vi.mocked(itemServiceMocks.create).mockResolvedValueOnce({ id: 'item-1' } as never);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/items`,
      payload: {
        name: 'Oil',
        imageUrlId: 'img-1',
        value: 10,
        isLimited: false,
        typeId: 'type-1',
        isActive: true,
      },
    });

    expect(res.statusCode).toBe(201);
    expect(itemServiceMocks.create).toHaveBeenCalledWith({
      userId: 'user-1',
      body: {
        name: 'Oil',
        imageUrlId: 'img-1',
        value: 10,
        isLimited: false,
        typeId: 'type-1',
        isActive: true,
      },
    });
    expect(res.json()).toEqual({ id: 'item-1' });
    await app.close();
  });

  it('PUT /api/v1/items/:id updates the item', async () => {
    const { app } = buildApp();
    vi.mocked(itemServiceMocks.update).mockResolvedValueOnce({ id: 'item-1' } as never);

    await app.ready();
    const res = await app.inject({
      method: 'PUT',
      url: `${API_PREFIX}/items/item-1`,
      payload: {
        name: 'Updated Item',
        imageUrlId: 'img-1',
        value: 10,
        isLimited: false,
        typeId: 'type-1',
        isActive: true,
      },
    });

    expect(res.statusCode).toBe(200);
    expect(itemServiceMocks.update).toHaveBeenCalledWith({
      id: 'item-1',
      userId: 'user-1',
      body: {
        name: 'Updated Item',
        imageUrlId: 'img-1',
        value: 10,
        isLimited: false,
        typeId: 'type-1',
        isActive: true,
      },
    });
    await app.close();
  });
});
