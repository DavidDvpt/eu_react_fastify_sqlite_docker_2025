import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import transactionRoutes from '../transactionRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

describe('transactionRoutes', () => {
  function buildApp() {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    const tx = {
      transaction: {
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      lot: {
        create: vi.fn(),
        update: vi.fn(),
      },
      transactionLot: {
        create: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
        count: vi.fn(),
      },
    };

    const prisma = {
      item: {
        findMany: vi.fn(),
      },
      $transaction: vi.fn((callback: (trx: typeof tx) => unknown) => Promise.resolve(callback(tx))),
    };

    const transactionRepository = {
      getSellSessions: vi.fn(),
      getRunningSellLines: vi.fn(),
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
    app.decorate('repos', {
      transactionRepository,
      lotStock,
    } as unknown as FastifyInstance['repos']);
    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role: 'USER', pseudo: 'john' };
      });
    });

    app.register(transactionRoutes, { prefix: API_PREFIX });

    return { app, transactionRepository, prisma, tx, lotStock };
  }

  it('POST /api/v1/transactions with type=buy creates transaction and IN line', async () => {
    const { app, tx, prisma } = buildApp();

    vi.mocked(prisma.item.findMany).mockResolvedValueOnce([{ id: 'item-1', value: 10 } as never]);
    vi.mocked(tx.transaction.create).mockResolvedValueOnce({ id: 'transaction-1' } as never);
    vi.mocked(tx.lot.create).mockResolvedValueOnce({ id: 'lot-1' } as never);
    vi.mocked(tx.transactionLot.create).mockResolvedValueOnce({ id: 'line-1' } as never);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/transactions`,
      payload: {
        type: 'buy',
        lines: [{ itemId: 'item-1', quantity: 2, tt: 20, fee: 1, ttc: 25 }],
      },
    });

    expect(res.statusCode).toBe(201);
    const buySessionCreateCall = vi.mocked(tx.transaction.create).mock.calls[0]?.[0] as {
      data: {
        status: string;
      };
    };
    expect(buySessionCreateCall.data.status).toBe('CLOSED');
    await app.close();
  });

  it('POST /api/v1/transactions with type=sell rejects when fee is missing', async () => {
    const { app } = buildApp();
    await app.ready();

    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/transactions`,
      payload: {
        type: 'sell',
        lines: [{ itemId: 'item-1', quantity: 1, tt: 10, ttc: 12 }],
      },
    });

    expect(res.statusCode).toBe(500);
    await app.close();
  });

  it('GET /api/v1/transactions/sell returns sell transactions with status filter', async () => {
    const { app, transactionRepository } = buildApp();
    vi.mocked(transactionRepository.getSellSessions).mockResolvedValueOnce([
      {
        transactionId: 'transaction-1',
        name: 'Oil',
        quantity: 100,
        totalPrice: 145,
        linesTotal: 2,
        saleStatus: 'RUNNING',
      },
    ]);

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${API_PREFIX}/transactions/sell?status=RUNNING`,
    });

    expect(res.statusCode).toBe(200);
    expect(transactionRepository.getSellSessions).toHaveBeenCalledWith('user-1', 'RUNNING');
    expect(res.json()).toEqual([
      {
        transactionId: 'transaction-1',
        name: 'Oil',
        quantity: 100,
        totalPrice: 145,
        linesTotal: 2,
        saleStatus: 'RUNNING',
      },
    ]);
    await app.close();
  });

  it('GET /api/v1/transactions/sell/running-lines returns running sell lines for authenticated user', async () => {
    const { app, transactionRepository } = buildApp();
    vi.mocked(transactionRepository.getRunningSellLines).mockResolvedValueOnce([
      {
        transactionLotId: 'line-1',
        transactionId: 'transaction-1',
        itemId: 'item-1',
        itemName: 'Oil',
        inventoryLotId: 'lot-1',
        quantity: 10,
        tt: 100,
        ttc: 112,
        lineStatus: 'OPENNED',
        saleStatus: 'RUNNING',
      },
    ]);

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${API_PREFIX}/transactions/sell/running-lines`,
    });

    expect(res.statusCode).toBe(200);
    expect(transactionRepository.getRunningSellLines).toHaveBeenCalledWith('user-1');
    expect(res.json()).toEqual([
      {
        transactionLotId: 'line-1',
        transactionId: 'transaction-1',
        itemId: 'item-1',
        itemName: 'Oil',
        inventoryLotId: 'lot-1',
        quantity: 10,
        tt: 100,
        ttc: 112,
        lineStatus: 'OPENNED',
        saleStatus: 'RUNNING',
      },
    ]);
    await app.close();
  });

  it('PATCH /api/v1/transactions/sell/lines/:id/status returns updated transaction line status', async () => {
    const { app, prisma, tx } = buildApp();
    vi.mocked(tx.transactionLot.findFirst).mockResolvedValueOnce({
      id: '11111111-1111-4111-8111-111111111111',
      transaction_id: 'transaction-1',
      inventory_lot_id: '22222222-2222-4222-8222-222222222222',
      quantity: 10,
    } as never);
    vi.mocked(tx.lot.update).mockResolvedValueOnce({} as never);
    vi.mocked(tx.transactionLot.update).mockResolvedValueOnce({} as never);
    vi.mocked(tx.transactionLot.count).mockResolvedValueOnce(0 as never);
    vi.mocked(tx.transaction.update).mockResolvedValueOnce({} as never);

    await app.ready();
    const res = await app.inject({
      method: 'PATCH',
      url: `${API_PREFIX}/transactions/sell/lines/11111111-1111-4111-8111-111111111111/status`,
      payload: { status: 'SOLDED' },
    });

    expect(res.statusCode).toBe(200);
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.transactionLot.findFirst).toHaveBeenCalledWith({
      where: {
        id: '11111111-1111-4111-8111-111111111111',
        user_id: 'user-1',
        line_type: 'OUT',
        sale_status: 'RUNNING',
      },
      select: {
        id: true,
        transaction_id: true,
        inventory_lot_id: true,
        quantity: true,
      },
    });
    expect(res.json()).toEqual({
      transactionId: 'transaction-1',
      transactionLotId: '11111111-1111-4111-8111-111111111111',
      saleStatus: 'SOLDED',
      lineStatus: 'CLOSED',
      transactionStatus: 'CLOSED',
    });
    await app.close();
  });
});
