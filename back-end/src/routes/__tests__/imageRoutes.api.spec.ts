import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import imageRoutes from '../imageRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

const {
  readFileMock,
  loadStorageImageIndexMock,
  buildStorageImageIndexMock,
  writeStorageImageIndexMock,
} = vi.hoisted(() => ({
  readFileMock: vi.fn(),
  loadStorageImageIndexMock: vi.fn(),
  buildStorageImageIndexMock: vi.fn(),
  writeStorageImageIndexMock: vi.fn(),
}));

vi.mock('node:fs/promises', async () => {
  const actual = await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises');
  return {
    ...actual,
    readFile: readFileMock,
  };
});

vi.mock('../../lib/storageImageIndex.js', async () => {
  const actual = await vi.importActual<typeof import('../../lib/storageImageIndex.js')>(
    '../../lib/storageImageIndex.js'
  );
  return {
    ...actual,
    loadStorageImageIndex: loadStorageImageIndexMock,
    buildStorageImageIndex: buildStorageImageIndexMock,
    writeStorageImageIndex: writeStorageImageIndexMock,
  };
});

describe('imageRoutes', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    loadStorageImageIndexMock.mockResolvedValue({
      generatedAt: new Date().toISOString(),
      micro: { '123': 'materials/123Micro.jpg' },
      normal: { '123': 'materials/123Normal.jpg' },
    });
    readFileMock.mockResolvedValue(Buffer.from('fake-jpeg'));
    buildStorageImageIndexMock.mockResolvedValue({
      generatedAt: new Date().toISOString(),
      micro: { '123': 'materials/123Micro.jpg' },
      normal: { '123': 'materials/123Normal.jpg' },
    });
    writeStorageImageIndexMock.mockResolvedValue(undefined);
  });

  function buildApp() {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.decorate('repos', {
      images: {
        getImageBufferById: vi.fn((id: string, size: 'micro' | 'normal') => {
          if (id === '123') return Promise.resolve(Buffer.from(`fake-${size}`));
          return Promise.resolve(null);
        }),
      },
    } as unknown as FastifyInstance['repos']);

    app.register(imageRoutes, { prefix: API_PREFIX });
    return { app };
  }

  it('GET /api/v1/storage/images/:id returns 400 for invalid image id', async () => {
    const { app } = buildApp();

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/storage/images/abc` });

    expect(res.statusCode).toBe(400);
    await app.close();
  });

  it('GET /api/v1/storage/images/:id returns 400 for invalid size query', async () => {
    const { app } = buildApp();

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${API_PREFIX}/storage/images/123?size=large`,
    });

    expect(res.statusCode).toBe(400);
    await app.close();
  });

  it('GET /api/v1/storage/images/:id returns 404 when image is missing', async () => {
    const { app } = buildApp();

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/storage/images/999` });

    expect(res.statusCode).toBe(404);
    await app.close();
  });

  it('GET /api/v1/storage/images/:id returns image/jpeg when found (default normal)', async () => {
    const { app } = buildApp();

    await app.ready();
    const res = await app.inject({ method: 'GET', url: `${API_PREFIX}/storage/images/123` });

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('image/jpeg');
    expect(res.body).toBe('fake-normal');
    await app.close();
  });

  it('GET /api/v1/storage/images/:id?size=micro returns image/jpeg when found', async () => {
    const { app } = buildApp();

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${API_PREFIX}/storage/images/123?size=micro`,
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('image/jpeg');
    expect(res.body).toBe('fake-micro');
    await app.close();
  });
});
