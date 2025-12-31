import { describe, expect, it } from 'vitest';

import { buildApp } from '../app.js'; // ajuste le chemin si besoin

describe('Repositories plugin', () => {
  it('expose les repositories sur fastify', async () => {
    const app = buildApp({ logger: false, registerRoutes: false });
    await app.ready();

    // Le container de repos existe
    expect(app.repos).toBeDefined();
    expect(typeof app.repos).toBe('object');

    // UserRepository existe
    expect(app.repos.users).toBeDefined();
    expect(typeof app.repos.users).toBe('object');

    // Méthodes CRUD minimales (contrat)
    expect(typeof app.repos.users.findUnique).toBe('function');
    expect(typeof app.repos.users.create).toBe('function');
    expect(typeof app.repos.users.findMany).toBe('function');
    expect(typeof app.repos.users.update).toBe('function');
    expect(typeof app.repos.users.delete).toBe('function');

    await app.close();
  });
});
