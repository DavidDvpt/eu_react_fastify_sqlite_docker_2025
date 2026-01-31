import { describe, expect, it } from 'vitest';

import { buildApp } from '../../app.js';

describe('auth plugin', () => {
  it('enregistre jwt et authenticate', async () => {
    const app = buildApp({ logger: false, registerRoutes: false });

    app.get('/_probe', async (request, reply) => {
      expect(typeof app.accessSign).toBe('function');
      expect(typeof app.refreshSign).toBe('function');
      return reply.send({ ok: true });
    });

    await app.ready();

    expect(typeof app.authenticate).toBe('function');
    expect(typeof app.accessSign).toBe('function');
    expect(typeof app.refreshSign).toBe('function');

    const res = await app.inject({ method: 'GET', url: '/_probe' });
    expect(res.statusCode).toBe(200);

    await app.close();
  });

  it('bloque sans token', async () => {
    const app = buildApp({ logger: false, registerRoutes: false });

    app.register((app) => {
      app.get('/private', { preHandler: [app.authenticate] }, () => ({ ok: true }));
    });

    await app.ready();

    const res = await app.inject({ method: 'GET', url: '/private' });
    expect(res.statusCode).toBe(401);

    await app.close();
  });
});
