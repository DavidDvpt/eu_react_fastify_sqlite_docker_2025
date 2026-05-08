import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import stockRoutes from '../inventoryRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

describe('stockRoutes', () => {
  function buildApp() {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    const tx = {
      item: {
        findMany: vi.fn(),
      },
      session: {
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      lot: {
        create: vi.fn(),
        update: vi.fn(),
      },
      sessionLine: {
        create: vi.fn(),
      },
    };

    const prisma = {
      item: {
        findMany: vi.fn(),
      },
      $transaction: vi.fn((callback: (trx: typeof tx) => unknown) => Promise.resolve(callback(tx))),
    };

    const lotStock = {
      getStock: vi.fn(),
      getStockByItemId: vi.fn(),
      getStockDetailsByItemId: vi.fn(),
      getAvailableStockByItemIds: vi.fn(),
      getAvailableLotsFifoByItemId: vi.fn(),
      getSellableLotById: vi.fn(),
    };

    app.decorate('prisma', prisma as unknown as FastifyInstance['prisma']);
    app.decorate('repos', { lotStock } as unknown as FastifyInstance['repos']);
    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role: 'USER', pseudo: 'john' };
      });
    });

    app.register(stockRoutes, { prefix: API_PREFIX });

    return { app, lotStock, tx, prisma };
  }

  it('GET /api/v1/inventory returns stock list for authenticated user', async () => {
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
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/inventory` });

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

  it('GET /api/v1/inventory`/:id returns item stock for authenticated user', async () => {
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
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/inventory/item-1` });

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

  it('GET /api/v1/inventory/:id?include=details returns stock details for item', async () => {
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
          quantityInitial: 250,
          sessionStatus: 'CLOSED',
          lineStatus: 'CLOSED',
          quantityExported: 50,
          priceRemaining: 40,
          dateCreated: '2025-10-21 13:37:17.68',
        },
      ],
      lotsOut: [
        {
          id: 'line-1',
          dateCreated: '2025-10-21 13:37:17.68',
          quantity: 50,
          lineStatus: 'CLOSED',
          sessionStatus: 'CLOSED',
          tt: 20,
          ttc: 25,
          saleStatus: 'SOLDED',
        },
      ],
    });

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${API_PREFIX}/inventory/item-1?include=details`,
    });

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
          quantityInitial: 250,
          sessionStatus: 'CLOSED',
          lineStatus: 'CLOSED',
          quantityExported: 50,
          priceRemaining: 40,
          dateCreated: '2025-10-21 13:37:17.68',
        },
      ],
      lotsOut: [
        {
          id: 'line-1',
          dateCreated: '2025-10-21 13:37:17.68',
          quantity: 50,
          lineStatus: 'CLOSED',
          sessionStatus: 'CLOSED',
          tt: 20,
          ttc: 25,
          saleStatus: 'SOLDED',
        },
      ],
    });
    await app.close();
  });

  it('GET /api/v1/inventory/:id returns 404 when item stock is not found', async () => {
    const { app, lotStock } = buildApp();
    vi.mocked(lotStock.getStockByItemId).mockResolvedValueOnce(null);

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/inventory/item-x` });

    expect(res.statusCode).toBe(404);
    await app.close();
  });

  it('POST /api/v1/inventory/transactions with type=buy creates session and IN line', async () => {
    const { app, tx, prisma } = buildApp();

    vi.mocked(prisma.item.findMany).mockResolvedValueOnce([{ id: 'item-1', value: 10 } as never]);
    vi.mocked(tx.session.create).mockResolvedValueOnce({ id: 'session-1' } as never);
    vi.mocked(tx.lot.create).mockResolvedValueOnce({ id: 'lot-1' } as never);
    vi.mocked(tx.sessionLine.create).mockResolvedValueOnce({ id: 'line-1' } as never);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/inventory/transactions`,
      payload: {
        type: 'buy',
        lines: [{ itemId: 'item-1', quantity: 2, tt: 20, fee: 1, ttc: 25 }],
      },
    });

    expect(res.statusCode).toBe(201);
    const buySessionCreateCall = vi.mocked(tx.session.create).mock.calls[0]?.[0] as {
      data: {
        status: string;
      };
    };
    expect(buySessionCreateCall.data.status).toBe('CLOSED');
    await app.close();
  });

  it('POST /api/v1/inventory/transactions with type=sell rejects when fee is missing', async () => {
    const { app } = buildApp();
    await app.ready();

    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/inventory/transactions`,
      payload: {
        type: 'sell',
        lines: [{ itemId: 'item-1', quantity: 1, tt: 10, ttc: 12 }],
      },
    });

    expect(res.statusCode).toBe(500);
    await app.close();
  });
});
