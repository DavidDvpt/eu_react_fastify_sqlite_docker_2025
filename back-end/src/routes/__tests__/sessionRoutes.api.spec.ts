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

    const sessionStats = {
      getSellSessions: vi.fn(),
    };

    app.decorate('repos', { sessionStats } as unknown as FastifyInstance['repos']);
    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role: 'USER', pseudo: 'john' };
      });
    });

    app.register(sessionRoutes, { prefix: API_PREFIX });

    return { app, sessionStats };
  }

  it('GET /api/v1/sessions/sell returns sell sessions with status filter', async () => {
    const { app, sessionStats } = buildApp();
    vi.mocked(sessionStats.getSellSessions).mockResolvedValueOnce([
      {
        sessionId: 'TRANSACTION-session-1',
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
    expect(sessionStats.getSellSessions).toHaveBeenCalledWith('user-1', 'RUNNING');
    expect(res.json()).toEqual([
      {
        sessionId: 'TRANSACTION-session-1',
        name: 'Oil',
        quantity: 100,
        totalPrice: 145,
        linesTotal: 2,
        saleStatus: 'RUNNING',
      },
    ]);
    await app.close();
  });
});
