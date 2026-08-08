import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import pedCardRoutes from '../pedCardRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

const pedcardServiceMocks = {
  hasInitialBalance: vi.fn(),
  getAll: vi.fn(),
  getBalance: vi.fn(),
  canPay: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

vi.mock('../../lib/services/prisma/pedcardService.js', () => ({
  PedcardService: vi.fn(function MockPedcardService() {
    return pedcardServiceMocks;
  }),
}));

describe('pedCardRoutes', () => {
  function buildApp() {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role: 'USER', pseudo: 'john' };
      });
    });

    app.register(pedCardRoutes, { prefix: API_PREFIX });

    return { app };
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/pedcard/check returns 200 when the user has an INITIAL_BALANCE row', async () => {
    const { app } = buildApp();
    vi.mocked(pedcardServiceMocks.hasInitialBalance).mockResolvedValueOnce(true as never);

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${API_PREFIX}/pedcard/check`,
    });

    expect(res.statusCode).toBe(200);
    expect(pedcardServiceMocks.hasInitialBalance).toHaveBeenCalledWith({ userId: 'user-1' });
    expect(res.json()).toEqual({ message: 'PedCard initialized' });
    await app.close();
  });

  it('GET /api/v1/pedcard/check returns 400 when the user has no INITIAL_BALANCE row', async () => {
    const { app } = buildApp();
    vi.mocked(pedcardServiceMocks.hasInitialBalance).mockResolvedValueOnce(false as never);

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${API_PREFIX}/pedcard/check`,
    });

    expect(res.statusCode).toBe(400);
    expect(pedcardServiceMocks.hasInitialBalance).toHaveBeenCalledWith({ userId: 'user-1' });
    expect(res.json()).toEqual({ message: 'PedCard must be initialized' });
    await app.close();
  });

  it('GET /api/v1/pedcard/balance returns the user balance', async () => {
    const { app } = buildApp();
    vi.mocked(pedcardServiceMocks.getBalance).mockResolvedValueOnce(115.5 as never);

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${API_PREFIX}/pedcard/balance`,
    });

    expect(res.statusCode).toBe(200);
    expect(pedcardServiceMocks.getBalance).toHaveBeenCalledWith({ userId: 'user-1' });
    expect(res.json()).toEqual({ balance: 115.5 });
    await app.close();
  });

  it('POST /api/v1/pedcard creates an entry and returns 201', async () => {
    const { app } = buildApp();
    vi.mocked(pedcardServiceMocks.create).mockResolvedValueOnce({ id: 'pedcard-1' } as never);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/pedcard`,
      payload: {
        value: 100,
        type: 'INITIAL_BALANCE',
        transactionId: null,
      },
    });

    expect(res.statusCode).toBe(201);
    expect(pedcardServiceMocks.create).toHaveBeenCalledWith({
      userId: 'user-1',
      body: { transactionId: undefined, type: 'INITIAL_BALANCE', value: 100 },
    });
    expect(res.json()).toEqual({ id: 'pedcard-1' });
    await app.close();
  });

  it('PATCH /api/v1/pedcard/:id updates an entry with only value', async () => {
    const { app } = buildApp();
    vi.mocked(pedcardServiceMocks.update).mockResolvedValueOnce({ id: 'pedcard-1' } as never);

    await app.ready();
    const res = await app.inject({
      method: 'PATCH',
      url: `${API_PREFIX}/pedcard/pedcard-1`,
      payload: {
        value: 150,
      },
    });

    expect(res.statusCode).toBe(200);
    expect(pedcardServiceMocks.update).toHaveBeenCalledWith({
      userId: 'user-1',
      id: 'pedcard-1',
      body: { value: 150 },
    });
    expect(res.json()).toEqual({ id: 'pedcard-1' });
    await app.close();
  });
});
