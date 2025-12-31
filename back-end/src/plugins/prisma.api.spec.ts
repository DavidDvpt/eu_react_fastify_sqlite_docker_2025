import { describe, expect, it } from 'vitest';

import { buildApp } from '../app.js';

describe('Prisma plugin', () => {
  it('enregistre prisma sur fastify', async () => {
    const app = buildApp({ logger: false, registerRoutes: false });
    await app.ready();

    expect(app.prisma).toBeDefined();
    expect(typeof app.prisma).toBe('object');

    await app.close();
  });
});
