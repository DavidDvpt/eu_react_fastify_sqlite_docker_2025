// src/plugins/authorize.spec.ts
import { describe, expect, it } from 'vitest';

import { buildApp } from '../../app.js';

describe('Authorize plugin', () => {
  it('enregistre authorize', async () => {
    const app = buildApp({ logger: false, registerRoutes: false });
    await app.ready();

    expect(typeof app.authorize).toBe('function');

    await app.close();
  });

  it('bloque si role absent dans le token', async () => {
    const app = buildApp({ logger: false, registerRoutes: false });

    app.register((scope, _opts, done) => {
      scope.get(
        '/admin-only',
        { preHandler: [scope.authenticate, scope.authorize(['ADMIN'])] },
        () => ({ ok: true })
      );

      done();
    });

    await app.ready();

    const token = app.jwt.access.sign({ sub: 'user-1' });

    const res = await app.inject({
      method: 'GET',
      url: '/admin-only',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(403);

    await app.close();
  });

  it('bloque si role incorrect', async () => {
    const app = buildApp({ logger: false, registerRoutes: false });

    app.register((scope, _opts, done) => {
      scope.get(
        '/admin-only',
        { preHandler: [scope.authenticate, scope.authorize(['ADMIN'])] },
        () => ({
          ok: true,
        })
      );

      done();
    });

    await app.ready();

    const token = app.jwt.access.sign({ sub: 'user-1', role: 'USER' });

    const res = await app.inject({
      method: 'GET',
      url: '/admin-only',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(403);

    await app.close();
  });

  it('autorise si role ok', async () => {
    const app = buildApp({ logger: false, registerRoutes: false });

    app.register((scope, _opts, done) => {
      scope.get(
        '/admin-only',
        { preHandler: [scope.authenticate, scope.authorize(['ADMIN'])] },
        () => ({ ok: true })
      );

      done();
    });

    await app.ready();
    const token = app.jwt.access.sign({ sub: 'admin-1', role: 'ADMIN' });

    const res = await app.inject({
      method: 'GET',
      url: '/admin-only',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });

    await app.close();
  });
});
