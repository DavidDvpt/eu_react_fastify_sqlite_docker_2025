import { describe, expect, it } from 'vitest';

import { signupBodySchema } from '../signup.Validation.js';

describe('signupBodySchema', () => {
  it('valide un payload correct', () => {
    const payload = {
      pseudo: 'yoda42',
      email: 'yoda@force.io',
      password: 'strongpassword',
      firstname: 'Yoda',
      lastname: 'Master',
    };

    const result = signupBodySchema.safeParse(payload);

    expect(result.success).toBe(true);
  });

  it('valide sans firstname / lastname', () => {
    const payload = {
      pseudo: 'yoda42',
      email: 'yoda@force.io',
      password: 'strongpassword',
    };

    const result = signupBodySchema.safeParse(payload);

    expect(result.success).toBe(true);
  });

  it('refuse un champ en trop', () => {
    const payload = {
      pseudo: 'yoda42',
      email: 'yoda@force.io',
      password: 'strongpassword',
      role: 'admin',
    };

    const result = signupBodySchema.safeParse(payload);

    expect(result.success).toBe(false);
  });

  it('refuse un password trop court', () => {
    const payload = {
      pseudo: 'yoda42',
      email: 'yoda@force.io',
      password: '123',
    };

    const result = signupBodySchema.safeParse(payload);

    expect(result.success).toBe(false);
  });

  it('refuse un email invalide', () => {
    const payload = {
      pseudo: 'yoda42',
      email: 'not-an-email',
      password: 'strongpassword',
    };

    const result = signupBodySchema.safeParse(payload);

    expect(result.success).toBe(false);
  });
});
