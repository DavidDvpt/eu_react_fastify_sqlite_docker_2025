import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import sessionRoutes from '../sessionRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

describe('sessionRoutes', () => {
  function buildApp() {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    const transactionRepository = {
      getSellSessions: vi.fn(),
      getRunningSellLines: vi.fn(),
    };

    app.decorate('repos', { transactionRepository } as unknown as FastifyInstance['repos']);
    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role: 'USER', pseudo: 'john' };
      });
    });

    app.register(sessionRoutes, { prefix: API_PREFIX });

    return { app, transactionRepository };
  }

  it('GET /api/v1/sessions/sell returns sell sessions with status filter', async () => {
    const { app, transactionRepository } = buildApp();
    vi.mocked(transactionRepository.getSellSessions).mockResolvedValueOnce([
      {
        sessionId: 'session-1',
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
      url: `${API_PREFIX}/sessions/sell?status=RUNNING`,
    });

    expect(res.statusCode).toBe(200);
    expect(transactionRepository.getSellSessions).toHaveBeenCalledWith('user-1', 'RUNNING');
    expect(res.json()).toEqual([
      {
        sessionId: 'session-1',
        name: 'Oil',
        quantity: 100,
        totalPrice: 145,
        linesTotal: 2,
        saleStatus: 'RUNNING',
      },
    ]);
    await app.close();
  });

  it('GET /api/v1/sessions/sell/running-lines returns running sell lines for authenticated user', async () => {
    const { app, transactionRepository } = buildApp();
    vi.mocked(transactionRepository.getRunningSellLines).mockResolvedValueOnce([
      {
        sessionLineId: 'line-1',
        sessionId: 'session-1',
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
      url: `${API_PREFIX}/sessions/sell/running-lines`,
    });

    expect(res.statusCode).toBe(200);
    expect(transactionRepository.getRunningSellLines).toHaveBeenCalledWith('user-1');
    expect(res.json()).toEqual([
      {
        sessionLineId: 'line-1',
        sessionId: 'session-1',
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
});
