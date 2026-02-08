// src/plugins/authorize.spec.ts
import { describe, expect, it } from 'vitest';

import { buildApp } from '../../app.js';

function decodeJwtPayload(token: string): Record<string, unknown> {
  const parts = token.split('.');
  if (parts.length < 2) throw new Error('Invalid JWT format');

  const base64Url = parts[1] ?? '';
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (base64.length % 4)) % 4;
  const padded = base64 + '='.repeat(padLength);

  const json = Buffer.from(padded, 'base64').toString('utf8');
  return JSON.parse(json) as Record<string, unknown>;
}

function expectTokenTtlSeconds(token: string, expectedSeconds: number) {
  const payload = decodeJwtPayload(token);

  expect(payload).toHaveProperty('iat');
  expect(payload).toHaveProperty('exp');

  const iat = payload.iat;
  const exp = payload.exp;

  expect(typeof iat).toBe('number');
  expect(typeof exp).toBe('number');

  const ttlSeconds = (exp as number) - (iat as number);

  expect(ttlSeconds).toBeGreaterThan(0);
  expect(ttlSeconds).toBeGreaterThanOrEqual(expectedSeconds - 5);
  expect(ttlSeconds).toBeLessThanOrEqual(expectedSeconds + 5);
}

describe('Authorize plugin', () => {
  it('enregistre authorize', async () => {
    const app = buildApp({ logger: false, registerRoutes: false });
    await app.ready();

    expect(typeof app.authorize).toBe('function');

    await app.close();
  });

  it('access token TTL ~= 24h', async () => {
    const app = buildApp({ logger: false, registerRoutes: false });
    await app.ready();

    const token = app.jwt.access.sign({ sub: 'user-1', role: 'USER' });

    expectTokenTtlSeconds(token, 24 * 60 * 60);

    await app.close();
  });

  it('refresh token TTL ~= 7d', async () => {
    const app = buildApp({ logger: false, registerRoutes: false });
    await app.ready();

    const token = app.jwt.refresh.sign({ sub: 'user-1' });
    expectTokenTtlSeconds(token, 7 * 24 * 60 * 60);

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
      cookies: {
        access_token: token,
      },
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
      cookies: {
        access_token: token,
      },
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
      cookies: {
        access_token: token,
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });

    await app.close();
  });
});
