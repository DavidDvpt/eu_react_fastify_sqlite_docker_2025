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

    const lotStock = {
      getStock: vi.fn(),
      getStockByItemId: vi.fn(),
      getStockDetailsByItemId: vi.fn(),
    };

    app.decorate('repos', { lotStock } as unknown as FastifyInstance['repos']);
    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role: 'USER', pseudo: 'john' };
      });
    });

    app.register(stockRoutes, { prefix: API_PREFIX });

    return { app, lotStock };
  }

  it('GET /api/v1/stock returns stock list for authenticated user', async () => {
    const { app, lotStock } = buildApp();
    vi.mocked(lotStock.getStock).mockResolvedValueOnce([
      {
        itemId: 'item-1',
        imageUrlId: '123',
        name: 'Oil',
        unitPrice: 5,
        quantity: 250,
        totalPrice: 1250,
      },
    ]);

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/stock` });

    expect(res.statusCode).toBe(200);
    expect(lotStock.getStock).toHaveBeenCalledWith('user-1');
    expect(res.json()).toEqual([
      {
        itemId: 'item-1',
        imageUrlId: '123',
        name: 'Oil',
        unitPrice: 5,
        quantity: 250,
        totalPrice: 1250,
      },
    ]);
    await app.close();
  });

  it('GET /api/v1/stock/:id returns item stock for authenticated user', async () => {
    const { app, lotStock } = buildApp();
    vi.mocked(lotStock.getStockByItemId).mockResolvedValueOnce({
      itemId: 'item-1',
      imageUrlId: '123',
      name: 'Oil',
      unitPrice: 5,
      quantity: 250,
      totalPrice: 1250,
    });

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/stock/item-1` });

    expect(res.statusCode).toBe(200);
    expect(lotStock.getStockByItemId).toHaveBeenCalledWith('user-1', 'item-1');
    expect(res.json()).toEqual({
      itemId: 'item-1',
      imageUrlId: '123',
      name: 'Oil',
      unitPrice: 5,
      quantity: 250,
      totalPrice: 1250,
    });
    await app.close();
  });

  it('GET /api/v1/stock/:id?include=details returns stock details for item', async () => {
    const { app, lotStock } = buildApp();
    vi.mocked(lotStock.getStockDetailsByItemId).mockResolvedValueOnce({
      itemId: 'item-1',
      imageUrlId: '123',
      name: 'Oil',
      unitPrice: 5,
      quantity: 250,
      totalPrice: 1250,
      lotsIn: [
        {
          id: 'lot-1',
          lotType: 'SESSION_LINE',
          quantityRemaining: 200,
          quantityExported: 50,
          priceRemaining: 40,
          dateCreated: '2025-10-21 13:37:17.68',
        },
      ],
      lotsOut: [
        {
          dateCreated: '2025-10-21 13:37:17.68',
          quantity: 50,
          tt: 20,
          ttc: 25,
          saleStatus: 'SOLDED',
        },
      ],
    });

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/stock/item-1?include=details` });

    expect(res.statusCode).toBe(200);
    expect(lotStock.getStockDetailsByItemId).toHaveBeenCalledWith('user-1', 'item-1');
    expect(res.json()).toEqual({
      itemId: 'item-1',
      imageUrlId: '123',
      name: 'Oil',
      unitPrice: 5,
      quantity: 250,
      totalPrice: 1250,
      lotsIn: [
        {
          id: 'lot-1',
          lotType: 'SESSION_LINE',
          quantityRemaining: 200,
          quantityExported: 50,
          priceRemaining: 40,
          dateCreated: '2025-10-21 13:37:17.68',
        },
      ],
      lotsOut: [
        {
          dateCreated: '2025-10-21 13:37:17.68',
          quantity: 50,
          tt: 20,
          ttc: 25,
          saleStatus: 'SOLDED',
        },
      ],
    });
    await app.close();
  });

  it('GET /api/v1/stock/:id returns 404 when item stock is not found', async () => {
    const { app, lotStock } = buildApp();
    vi.mocked(lotStock.getStockByItemId).mockResolvedValueOnce(null);

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/stock/item-x` });

    expect(res.statusCode).toBe(404);
    await app.close();
  });
});
