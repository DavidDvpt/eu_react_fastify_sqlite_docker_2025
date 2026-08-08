import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import { errorHandler } from '../../plugins/errorHandler.js';
import transactionRoutes from '../transactionRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

const transactionServiceMocks = {
  getAll: vi.fn(),
  getById: vi.fn(),
  buy: vi.fn(),
  sell: vi.fn(),
  updateStatus: vi.fn(),
  cancel: vi.fn(),
};

vi.mock('../../lib/services/prisma/transactionService.js', () => ({
  TransactionService: vi.fn(function MockTransactionService() {
    return transactionServiceMocks;
  }),
}));

describe('transactionRoutes', () => {
  function buildApp() {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.setErrorHandler(errorHandler);

    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role: 'USER', pseudo: 'john' };
      });
    });

    app.register(transactionRoutes, { prefix: `${API_PREFIX}/transactions` });

    return { app };
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/transactions returns filtered transactions for authenticated user', async () => {
    const { app } = buildApp();
    const rows = [
      {
        id: 'transaction-1',
        transactionType: 'SELL',
        status: 'RUNNING',
      },
    ];
    vi.mocked(transactionServiceMocks.getAll).mockResolvedValueOnce(rows as never);

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${API_PREFIX}/transactions?status=SOLDED&type=SELL&itemId=item-1`,
    });

    expect(res.statusCode).toBe(200);
    expect(transactionServiceMocks.getAll).toHaveBeenCalledWith({
      userId: 'user-1',
      status: 'SOLDED',
      transactionType: 'SELL',
      itemId: 'item-1',
    });
    expect(res.json()).toEqual(rows);
    await app.close();
  });

  it('GET /api/v1/transactions/:id returns one transaction for authenticated user', async () => {
    const { app } = buildApp();
    const row = {
      id: 'transaction-1',
      transactionType: 'BUY',
      status: 'SOLDED',
    };
    vi.mocked(transactionServiceMocks.getById).mockResolvedValueOnce(row as never);

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${API_PREFIX}/transactions/transaction-1`,
    });

    expect(res.statusCode).toBe(200);
    expect(transactionServiceMocks.getById).toHaveBeenCalledWith({
      userId: 'user-1',
      id: 'transaction-1',
    });
    expect(res.json()).toEqual(row);
    await app.close();
  });

  it('POST /api/v1/transactions dispatches BUY payloads to the buy service', async () => {
    const { app } = buildApp();
    const payload = {
      itemId: 'item-1',
      quantity: 2,
      tt: 20,
      ttc: 25,
      fee: 1,
      transactionType: 'BUY',
      status: 'SOLDED',
    } as const;
    vi.mocked(transactionServiceMocks.buy).mockResolvedValueOnce({ id: 'transaction-1' } as never);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/transactions`,
      payload,
    });

    expect(res.statusCode).toBe(201);
    expect(transactionServiceMocks.buy).toHaveBeenCalledWith({
      userId: 'user-1',
      body: payload,
    });
    expect(transactionServiceMocks.sell).not.toHaveBeenCalled();
    expect(res.json()).toEqual({ id: 'transaction-1' });
    await app.close();
  });

  it('POST /api/v1/transactions dispatches SELL payloads to the sell service', async () => {
    const { app } = buildApp();
    const payload = {
      itemId: 'item-1',
      quantity: 1,
      tt: 10,
      ttc: 12,
      fee: 2,
      transactionType: 'SELL',
      status: 'RUNNING',
    } as const;
    vi.mocked(transactionServiceMocks.sell).mockResolvedValueOnce({ id: 'transaction-2' } as never);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/transactions`,
      payload,
    });

    expect(res.statusCode).toBe(201);
    expect(transactionServiceMocks.sell).toHaveBeenCalledWith({
      userId: 'user-1',
      body: payload,
    });
    expect(transactionServiceMocks.buy).not.toHaveBeenCalled();
    expect(res.json()).toEqual({ id: 'transaction-2' });
    await app.close();
  });

  it('PATCH /api/v1/transactions/:id/status updates a running transaction status', async () => {
    const { app } = buildApp();
    vi.mocked(transactionServiceMocks.updateStatus).mockResolvedValueOnce(undefined as never);

    await app.ready();
    const res = await app.inject({
      method: 'PATCH',
      url: `${API_PREFIX}/transactions/transaction-1/status`,
      headers: {
        'content-type': 'application/json',
      },
      payload: JSON.stringify('SOLDED'),
    });

    expect(res.statusCode).toBe(200);
    expect(transactionServiceMocks.updateStatus).toHaveBeenCalledWith({
      userId: 'user-1',
      id: 'transaction-1',
      status: 'SOLDED',
    });
    expect(res.body).toBe('');
    await app.close();
  });

  it('PATCH /api/v1/transactions/:id/cancel cancels a transaction', async () => {
    const { app } = buildApp();
    vi.mocked(transactionServiceMocks.cancel).mockResolvedValueOnce(undefined as never);

    await app.ready();
    const res = await app.inject({
      method: 'PATCH',
      url: `${API_PREFIX}/transactions/transaction-1/cancel`,
      headers: {
        'content-type': 'application/json',
      },
      payload: JSON.stringify('CANCELED'),
    });

    expect(res.statusCode).toBe(200);
    expect(transactionServiceMocks.cancel).toHaveBeenCalledWith({
      userId: 'user-1',
      id: 'transaction-1',
      status: 'CANCELED',
    });
    expect(res.body).toBe('');
    await app.close();
  });

  it('PATCH /api/v1/transactions/:id/status rejects unsupported statuses', async () => {
    const { app } = buildApp();

    await app.ready();
    const res = await app.inject({
      method: 'PATCH',
      url: `${API_PREFIX}/transactions/transaction-1/status`,
      headers: {
        'content-type': 'application/json',
      },
      payload: JSON.stringify('RUNNING'),
    });

    expect(res.statusCode).toBe(422);
    expect(transactionServiceMocks.updateStatus).not.toHaveBeenCalled();
    await app.close();
  });
});
