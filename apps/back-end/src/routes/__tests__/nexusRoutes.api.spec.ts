import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import nexusRoutes from '../nexusRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

const nexusServiceMocks = {
  getAll: vi.fn(),
  count: vi.fn(),
  createMany: vi.fn(),
};

const typeServiceMocks = {
  count: vi.fn(),
  getAll: vi.fn(),
  isTypeExists: vi.fn(),
};

const itemServiceMocks = {
  groupByType: vi.fn(),
};

vi.mock('#prisma/prismaClient.js', () => ({
  default: {},
}));

vi.mock('#src/lib/services/index.js', () => ({
  TypeService: vi.fn(function MockTypeService() {
    return typeServiceMocks;
  }),
  ItemService: vi.fn(function MockItemService() {
    return itemServiceMocks;
  }),
}));

vi.mock('#src/lib/services/prisma/NexusService.js', () => ({
  NexusService: vi.fn(function MockNexusService() {
    return nexusServiceMocks;
  }),
}));

describe('nexusRoutes', () => {
  function buildApp(role: 'USER' | 'ADMIN' = 'ADMIN') {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role, pseudo: 'john' };
      });
    });
    app.decorate('adminProtect', function (this: FastifyInstance) {
      this.addHook('preHandler', async (request, reply) => {
        if (request.user.role !== 'ADMIN') {
          return reply.code(403).send({ message: 'Not authorized' });
        }
      });
    });

    app.register(nexusRoutes, { prefix: `${API_PREFIX}/nexus-tools` });

    return { app };
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/v1/nexus-tools/init returns 204 when nexus table is already initialized', async () => {
    const { app } = buildApp();
    vi.mocked(nexusServiceMocks.count).mockResolvedValueOnce({ count: 1 });
    vi.mocked(typeServiceMocks.count).mockResolvedValueOnce({ count: 3 });

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/nexus-tools/init`,
    });

    expect(res.statusCode).toBe(204);
    expect(nexusServiceMocks.createMany).not.toHaveBeenCalled();
    await app.close();
  });

  it('POST /api/v1/nexus-tools/init returns inserted count', async () => {
    const { app } = buildApp();
    vi.mocked(nexusServiceMocks.count).mockResolvedValueOnce({ count: 0 });
    vi.mocked(typeServiceMocks.count).mockResolvedValueOnce({ count: 2 });
    vi.mocked(itemServiceMocks.groupByType)
      .mockResolvedValueOnce({ 'type-1': 4, 'type-2': 1 })
      .mockResolvedValueOnce({ 'type-1': 2 });
    vi.mocked(typeServiceMocks.getAll).mockResolvedValueOnce([
      { id: 'type-1', name: 'Finders' },
      { id: 'type-2', name: 'Refiners' },
    ] as never);
    vi.mocked(nexusServiceMocks.createMany).mockResolvedValueOnce({ count: 2 });

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/nexus-tools/init`,
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toBe(2);
    expect(nexusServiceMocks.createMany).toHaveBeenCalledWith({
      values: [
        expect.objectContaining({
          id: 'type-1',
          name: 'Finders',
          itemCount: 4,
          imageMissingCount: 2,
        }),
        expect.objectContaining({
          id: 'type-2',
          name: 'Refiners',
          itemCount: 1,
          imageMissingCount: 0,
        }),
      ],
    });
    await app.close();
  });
});
