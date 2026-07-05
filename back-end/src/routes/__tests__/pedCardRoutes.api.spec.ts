import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import pedCardRoutes from '../pedCardRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

describe('pedCardRoutes', () => {
  function buildApp() {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    const pedCard = {
      hasInitialBalance: vi.fn(),
      getBalance: vi.fn(),
      create: vi.fn(),
    };

    app.decorate('repos', { pedCard } as unknown as FastifyInstance['repos']);
    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role: 'USER', pseudo: 'john' };
      });
    });

    app.register(pedCardRoutes, { prefix: API_PREFIX });

    return { app, pedCard };
  }

  it('GET /api/v1/pedcard/check returns 200 when the user has an INITIAL_BALANCE row', async () => {
    const { app, pedCard } = buildApp();
    vi.mocked(pedCard.hasInitialBalance).mockResolvedValueOnce(true);

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${API_PREFIX}/pedcard/check`,
    });

    expect(res.statusCode).toBe(200);
    expect(pedCard.hasInitialBalance).toHaveBeenCalledWith('user-1');
    expect(res.json()).toEqual({ message: 'PedCard initialized' });
    await app.close();
  });

  it('GET /api/v1/pedcard/check returns 400 when the user has no INITIAL_BALANCE row', async () => {
    const { app, pedCard } = buildApp();
    vi.mocked(pedCard.hasInitialBalance).mockResolvedValueOnce(false);

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${API_PREFIX}/pedcard/check`,
    });

    expect(res.statusCode).toBe(400);
    expect(pedCard.hasInitialBalance).toHaveBeenCalledWith('user-1');
    expect(res.json()).toEqual({ message: 'PedCard must be initialized' });
    await app.close();
  });

  it('GET /api/v1/pedcard/balance returns the user balance', async () => {
    const { app, pedCard } = buildApp();
    vi.mocked(pedCard.getBalance).mockResolvedValueOnce(115.5);

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${API_PREFIX}/pedcard/balance`,
    });

    expect(res.statusCode).toBe(200);
    expect(pedCard.getBalance).toHaveBeenCalledWith('user-1');
    expect(res.json()).toEqual({ balance: 115.5 });
    await app.close();
  });

  it('POST /api/v1/pedcard creates an entry and returns 201 with no body', async () => {
    const { app, pedCard } = buildApp();
    vi.mocked(pedCard.create).mockResolvedValueOnce({
      id: 'ped-1',
      userId: 'user-1',
      transactionId: null,
      type: 'INITIAL_BALANCE',
      value: 100,
      createdAt: new Date('2026-07-05T00:00:00.000Z'),
    });

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/pedcard`,
      payload: {
        value: 100,
        type: 'INITIAL_BALANCE',
      },
    });

    expect(res.statusCode).toBe(201);
    expect(pedCard.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        transactionId: null,
        type: 'INITIAL_BALANCE',
        value: 100,
      },
    });
    expect(res.body).toBe('');
    await app.close();
  });
});
