// src/plugins/jwt.spec.ts
import { describe, expect, it } from 'vitest';

import { buildApp } from '../app.js';

describe('JWT plugin', () => {
  it('enregistre jwt et authenticate', async () => {
    const app = buildApp();
    await app.ready();

    expect(typeof app.authenticate).toBe('function');
    expect(typeof app.jwt.sign).toBe('function');

    // check sign and verify
    const token = app.jwt.sign({ sub: 'user-1' });
    const decoded = app.jwt.verify<{ sub: string }>(token);
    expect(decoded.sub).toBe('user-1');

    await app.close();
  });

  it('bloque sans token', async () => {
    const app = buildApp();

    app.register((scope, _opts, done) => {
      scope.get('/private', { preHandler: [scope.authenticate] }, () => ({ ok: true }));
      done();
    });
    await app.ready();

    const res = await app.inject({ method: 'GET', url: '/private' });
    expect(res.statusCode).toBe(401);

    await app.close();
  });
});
