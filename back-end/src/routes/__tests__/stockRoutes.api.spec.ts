import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import stockRoutes from '../stockRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

describe('stockRoutes', () => {
  function buildApp() {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    const lotStats = {
      getStock: vi.fn(),
      getStockByItemId: vi.fn(),
    };

    app.decorate('repos', { lotStats } as unknown as FastifyInstance['repos']);
    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role: 'USER', pseudo: 'john' };
      });
    });

    app.register(stockRoutes, { prefix: API_PREFIX });

    return { app, lotStats };
  }

  it('GET /api/v1/stock returns stock list for authenticated user', async () => {
    const { app, lotStats } = buildApp();
    vi.mocked(lotStats.getStock).mockResolvedValueOnce([
      { itemId: 'item-1', name: 'Oil', quantity: 250, totalPrice: 1250 },
    ]);

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/stock` });

    expect(res.statusCode).toBe(200);
    expect(lotStats.getStock).toHaveBeenCalledWith('user-1');
    expect(res.json()).toEqual([
      { itemId: 'item-1', name: 'Oil', quantity: 250, totalPrice: 1250 },
    ]);
    await app.close();
  });

  it('GET /api/v1/stock/:id returns item stock for authenticated user', async () => {
    const { app, lotStats } = buildApp();
    vi.mocked(lotStats.getStockByItemId).mockResolvedValueOnce({
      itemId: 'item-1',
      name: 'Oil',
      quantity: 250,
      totalPrice: 1250,
    });

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/stock/item-1` });

    expect(res.statusCode).toBe(200);
    expect(lotStats.getStockByItemId).toHaveBeenCalledWith('user-1', 'item-1');
    expect(res.json()).toEqual({ itemId: 'item-1', name: 'Oil', quantity: 250, totalPrice: 1250 });
    await app.close();
  });

  it('GET /api/v1/stock/:id returns 404 when item stock is not found', async () => {
    const { app, lotStats } = buildApp();
    vi.mocked(lotStats.getStockByItemId).mockResolvedValueOnce(null);

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/stock/item-x` });

    expect(res.statusCode).toBe(404);
    await app.close();
  });
});
