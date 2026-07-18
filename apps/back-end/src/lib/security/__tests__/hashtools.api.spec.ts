import { describe, expect, it } from 'vitest';

import HashTools from '../HashTools.js'; // adapte le chemin

describe('HashTools', () => {
  it('hashPassword retourne un hash (différent du password)', async () => {
    const password = 'Password123!';
    const hash = await HashTools.hashPassword(password);

    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(20);
    expect(hash).not.toBe(password);
    expect(hash.startsWith('$argon2')).toBe(true);
  });

  it('hashPassword produit des hashes différents pour le même password (salt)', async () => {
    const password = 'Password123!';
    const h1 = await HashTools.hashPassword(password);
    const h2 = await HashTools.hashPassword(password);

    expect(h1).not.toBe(h2);
  });

  it('verifyPassword retourne true avec le bon password', async () => {
    const password = 'Password123!';
    const hash = await HashTools.hashPassword(password);

    const ok = await HashTools.verifyPassword(hash, password);
    expect(ok).toBe(true);
  });

  it('verifyPassword retourne false avec un mauvais password', async () => {
    const password = 'Password123!';
    const hash = await HashTools.hashPassword(password);

    const ok = await HashTools.verifyPassword(hash, 'WrongPassword!');
    expect(ok).toBe(false);
  });
});
