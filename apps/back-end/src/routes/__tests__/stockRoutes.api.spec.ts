import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import stockRoutes from '../inventoryRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

const inventoryServiceMocks = {
  getLots: vi.fn(),
  getStocks: vi.fn(),
};

vi.mock('../../lib/services/domain/index.js', () => ({
  InventoryService: vi.fn(function MockInventoryService() {
    return inventoryServiceMocks;
  }),
  StockService: vi.fn(function MockStockService() {
    return {};
  }),
}));

describe('stockRoutes', () => {
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

    app.register(stockRoutes, { prefix: API_PREFIX });

    return { app };
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/inventory/lots returns lots for authenticated user', async () => {
    const { app } = buildApp();
    vi.mocked(inventoryServiceMocks.getLots).mockResolvedValueOnce([
      {
        id: 'lot-1',
        itemId: 'item-1',
        quantityRemaining: 2,
      },
    ] as never);

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${API_PREFIX}/inventory/lots?sortKey=createdAt&isActive=true`,
    });

    expect(res.statusCode).toBe(200);
    expect(inventoryServiceMocks.getLots).toHaveBeenCalledWith({
      userId: 'user-1',
      isActive: true,
      sort: { key: 'createdAt', order: undefined },
    });
    expect(res.json()).toEqual([
      {
        id: 'lot-1',
        itemId: 'item-1',
        quantityRemaining: 2,
      },
    ]);
    await app.close();
  });

  it('GET /api/v1/inventory/stock returns aggregated stocks for authenticated user', async () => {
    const { app } = buildApp();
    vi.mocked(inventoryServiceMocks.getStocks).mockResolvedValueOnce({ 'item-1': 5 } as never);

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${API_PREFIX}/inventory/stock?sortKey=createdAt&isActive=true`,
    });

    expect(res.statusCode).toBe(200);
    expect(inventoryServiceMocks.getStocks).toHaveBeenCalledWith({
      userId: 'user-1',
      isActive: true,
      sort: { key: 'createdAt', order: undefined },
    });
    expect(res.json()).toEqual({ 'item-1': 5 });
    await app.close();
  });

  it('GET /api/v1/inventory/stock forwards explicit sort order', async () => {
    const { app } = buildApp();
    vi.mocked(inventoryServiceMocks.getStocks).mockResolvedValueOnce({ 'item-1': 5 } as never);

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${API_PREFIX}/inventory/stock?sortKey=quantityRemaining&sortOrder=desc&isActive=false`,
    });

    expect(res.statusCode).toBe(200);
    expect(inventoryServiceMocks.getStocks).toHaveBeenCalledWith({
      userId: 'user-1',
      isActive: false,
      sort: { key: 'quantityRemaining', order: 'desc' },
    });
    await app.close();
  });

  it('GET /api/v1/inventory/lots validates query params', async () => {
    const { app } = buildApp();

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${API_PREFIX}/inventory/lots`,
    });

    expect(res.statusCode).toBe(500);
    await app.close();
  });
});
