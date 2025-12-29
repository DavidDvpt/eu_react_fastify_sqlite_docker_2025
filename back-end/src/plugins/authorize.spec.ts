// src/plugins/authorize.spec.ts
import { describe, expect, it } from 'vitest';

import { buildApp } from '../app.js';

describe('Authorize plugin', () => {
  it('enregistre authorize', async () => {
    const app = buildApp();
    await app.ready();

    expect(typeof app.authorize).toBe('function');

    await app.close();
  });

  it('bloque si role absent dans le token', async () => {
    const app = buildApp();
    await app.ready();

    app.get('/admin-only', { preHandler: [app.authenticate, app.authorize(['admin'])] }, () => ({
      ok: true,
    }));

    const token = app.jwt.sign({ sub: 'user-1' });
    const res = await app.inject({
      method: 'GET',
      url: '/admin-only',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(403);

    await app.close();
  });

  it('bloque si role incorrect', async () => {
    const app = buildApp();
    await app.ready();

    app.get('/admin-only', { preHandler: [app.authenticate, app.authorize(['admin'])] }, () => ({
      ok: true,
    }));

    const token = app.jwt.sign({ sub: 'user-1', role: 'user' });
    const res = await app.inject({
      method: 'GET',
      url: '/admin-only',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(403);

    await app.close();
  });

  it('autorise si role ok', async () => {
    const app = buildApp();
    await app.ready();

    app.get('/admin-only', { preHandler: [app.authenticate, app.authorize(['admin'])] }, () => ({
      ok: true,
    }));

    const token = app.jwt.sign({ sub: 'admin-1', role: 'admin' });
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
