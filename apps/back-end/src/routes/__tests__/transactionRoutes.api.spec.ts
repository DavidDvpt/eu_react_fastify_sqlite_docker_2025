import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import type {} from '../../types/fastify-augment.js';
import transactionRoutes from '../transactionRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

type MockFn = ReturnType<typeof vi.fn>;

type TransactionTxStub = {
  item: {
    findMany: MockFn;
  };
  transaction: {
    create: MockFn;
    update: MockFn;
    delete: MockFn;
  };
  lot: {
    create: MockFn;
    update: MockFn;
  };
  transactionLot: {
    create: MockFn;
    findFirst: MockFn;
    update: MockFn;
    count: MockFn;
  };
  pedCard: {
    aggregate: MockFn;
    create: MockFn;
    createMany: MockFn;
    upsert: MockFn;
  };
};

type TransactionTestPrisma = {
  item: {
    findMany: MockFn;
  };
  $transaction: (callback: (trx: TransactionTxStub) => unknown) => Promise<unknown>;
};

type TransactionTestRepos = {
  transaction: {
    getRunningSellLines: MockFn;
  };
  lotStock: {
    getStock: MockFn;
    getStockByItemId: MockFn;
    getStockDetailsByItemId: MockFn;
    getAvailableStockByItemIds: MockFn;
    getAvailableLotsFifoByItemId: MockFn;
    getSellableLotById: MockFn;
  };
};

describe('transactionRoutes', () => {
  function buildApp() {
    const tx = {
      item: {
        findMany: vi.fn(),
      },
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
      pedCard: {
        aggregate: vi.fn(),
        create: vi.fn(),
        createMany: vi.fn(),
        upsert: vi.fn(),
      },
    } satisfies TransactionTxStub;

    const prisma = {
      item: {
        findMany: vi.fn(),
      },
      $transaction: vi.fn((callback: (trx: typeof tx) => unknown) => Promise.resolve(callback(tx))),
    } satisfies TransactionTestPrisma;

    const transaction = {
      getRunningSellLines: vi.fn(),
    } satisfies TransactionTestRepos['transaction'];

    const lotStock = {
      getStock: vi.fn(),
      getStockByItemId: vi.fn(),
      getStockDetailsByItemId: vi.fn(),
      getAvailableStockByItemIds: vi.fn(),
      getAvailableLotsFifoByItemId: vi.fn(),
      getSellableLotById: vi.fn(),
    } satisfies TransactionTestRepos['lotStock'];

    const app = Object.assign(Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>(), {
      prisma,
      repos: {
        transaction,
        lotStock,
      },
      protect(this: FastifyInstance) {
        // eslint-disable-next-line @typescript-eslint/require-await
        this.addHook('preHandler', async (request) => {
          request.user = { id: 'user-1', role: 'USER', pseudo: 'john' };
        });
      },
    });

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.register(transactionRoutes, { prefix: API_PREFIX });

    return { app, transaction, prisma, tx, lotStock };
  }

  it('POST /api/v1/transactions with type=buy creates transaction and IN line', async () => {
    const { app, tx, prisma } = buildApp();

    vi.mocked(prisma.item.findMany).mockResolvedValueOnce([{ id: 'item-1', value: 10 } as never]);
    vi.mocked(tx.pedCard.aggregate).mockResolvedValueOnce({ _sum: { value: 100 } } as never);
    vi.mocked(tx.transaction.create).mockResolvedValueOnce({ id: 'transaction-1' } as never);
    vi.mocked(tx.pedCard.createMany).mockResolvedValueOnce({ count: 2 } as never);
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
    expect(tx.pedCard.createMany).toHaveBeenCalledWith({
      data: [
        {
          userId: 'user-1',
          transactionId: 'transaction-1',
          type: 'BUY_FEE',
          value: -1,
        },
        {
          userId: 'user-1',
          transactionId: 'transaction-1',
          type: 'BUY_TTC',
          value: -25,
        },
      ],
    });
    const buySessionCreateCall = vi.mocked(tx.transaction.create).mock.calls[0]?.[0] as {
      data: {
        status: string;
      };
    };
    expect(buySessionCreateCall.data.status).toBe('CLOSED');
    await app.close();
  });

  it('POST /api/v1/transactions with type=buy rejects when pedcard balance is insufficient', async () => {
    const { app, tx, prisma } = buildApp();

    vi.mocked(prisma.item.findMany).mockResolvedValueOnce([{ id: 'item-1', value: 10 } as never]);
    vi.mocked(tx.pedCard.aggregate).mockResolvedValueOnce({ _sum: { value: 10 } } as never);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/transactions`,
      payload: {
        type: 'buy',
        lines: [{ itemId: 'item-1', quantity: 2, tt: 20, fee: 1, ttc: 25 }],
      },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ message: 'Insufficient pedCard balance' });
    expect(tx.transaction.create).not.toHaveBeenCalled();
    expect(tx.pedCard.createMany).not.toHaveBeenCalled();
    await app.close();
  });

  it('POST /api/v1/transactions with type=sell creates a fee pedcard entry only', async () => {
    const { app, tx, lotStock } = buildApp();

    vi.mocked(lotStock.getAvailableStockByItemIds).mockResolvedValueOnce([
      { itemId: 'item-1', availableQuantity: 10 },
    ] as never);
    vi.mocked(lotStock.getAvailableLotsFifoByItemId).mockResolvedValueOnce([
      { id: 'lot-1', quantityRemaining: 10, priceRemaining: 100, itemId: 'item-1' },
    ] as never);
    vi.mocked(tx.item.findMany).mockResolvedValueOnce([
      { id: 'item-1', value: 10, is_stackable: true },
    ] as never);
    vi.mocked(tx.pedCard.aggregate).mockResolvedValueOnce({ _sum: { value: 50 } } as never);
    vi.mocked(tx.transaction.create).mockResolvedValueOnce({ id: 'transaction-2' } as never);
    vi.mocked(tx.pedCard.createMany).mockResolvedValueOnce({ count: 1 } as never);
    vi.mocked(tx.transactionLot.create).mockResolvedValueOnce({ id: 'line-2' } as never);
    vi.mocked(tx.lot.update).mockResolvedValueOnce({} as never);
    vi.mocked(tx.transaction.update).mockResolvedValueOnce({} as never);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/transactions`,
      payload: {
        type: 'sell',
        lines: [{ itemId: 'item-1', quantity: 1, tt: 10, ttc: 12, fee: 2 }],
      },
    });

    expect(res.statusCode).toBe(201);
    expect(tx.pedCard.createMany).toHaveBeenCalledWith({
      data: [
        {
          userId: 'user-1',
          transactionId: 'transaction-2',
          type: 'SELL_FEE',
          value: -2,
        },
      ],
    });
    await app.close();
  });

  it('POST /api/v1/transactions with type=sell accepts payload without status', async () => {
    const { app, tx, lotStock } = buildApp();

    vi.mocked(lotStock.getAvailableStockByItemIds).mockResolvedValueOnce([
      { itemId: 'item-1', availableQuantity: 10 },
    ] as never);
    vi.mocked(lotStock.getAvailableLotsFifoByItemId).mockResolvedValueOnce([
      { id: 'lot-1', quantityRemaining: 10, priceRemaining: 100, itemId: 'item-1' },
    ] as never);
    vi.mocked(tx.item.findMany).mockResolvedValueOnce([
      { id: 'item-1', value: 10, is_stackable: true },
    ] as never);
    vi.mocked(tx.pedCard.aggregate).mockResolvedValueOnce({ _sum: { value: 50 } } as never);
    vi.mocked(tx.transaction.create).mockResolvedValueOnce({ id: 'transaction-2' } as never);
    vi.mocked(tx.pedCard.createMany).mockResolvedValueOnce({ count: 1 } as never);
    vi.mocked(tx.transactionLot.create).mockResolvedValueOnce({ id: 'line-2' } as never);
    vi.mocked(tx.lot.update).mockResolvedValueOnce({} as never);
    vi.mocked(tx.transaction.update).mockResolvedValueOnce({} as never);

    await app.ready();

    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/transactions`,
      payload: {
        type: 'sell',
        lines: [{ itemId: 'item-1', quantity: 1, tt: 10, ttc: 12, fee: 2 }],
      },
    });

    expect(res.statusCode).toBe(201);
    await app.close();
  });

  it('GET /api/v1/transactions/running-lines returns running sell lines for authenticated user', async () => {
    const { app, transaction } = buildApp();
    vi.mocked(transaction.getRunningSellLines).mockResolvedValueOnce([
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
      url: `${API_PREFIX}/transactions/running-lines`,
    });

    expect(res.statusCode).toBe(200);
    expect(transaction.getRunningSellLines).toHaveBeenCalledWith('user-1');
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
      ttc: 112,
    } as never);
    vi.mocked(tx.lot.update).mockResolvedValueOnce({} as never);
    vi.mocked(tx.pedCard.upsert).mockResolvedValueOnce({} as never);
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
        ttc: true,
      },
    });
    expect(tx.pedCard.upsert).toHaveBeenCalledWith({
      where: {
        transactionId_type: {
          transactionId: 'transaction-1',
          type: 'SELL_TTC',
        },
      },
      create: {
        userId: 'user-1',
        transactionId: 'transaction-1',
        type: 'SELL_TTC',
        value: 112,
      },
      update: {
        value: {
          increment: 112,
        },
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
