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
});
