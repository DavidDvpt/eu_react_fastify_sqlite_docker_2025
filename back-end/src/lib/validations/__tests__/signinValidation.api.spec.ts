import { describe, expect, it } from 'vitest';

import { signinBodySchema } from '../signin.Validation.js';

describe('signupBodySchema', () => {
  it('valide un payload correct', () => {
    const payload = {
      pseudo: 'yoda42',
      password: 'strongpassword',
    };

    const result = signinBodySchema.safeParse(payload);

    expect(result.success).toBe(true);
  });

  it('refuse un champ en trop', () => {
    const payload = {
      pseudo: 'yoda42',
      email: 'yoda@force.io',
      password: 'strongpassword',
    };

    const result = signinBodySchema.safeParse(payload);

    expect(result.success).toBe(false);
  });

  it('refuse un password trop court', () => {
    const payload = {
      pseudo: 'yoda42',
      password: '123',
    };

    const result = signinBodySchema.safeParse(payload);

    expect(result.success).toBe(false);
  });

  it('refuse un pseudo trop court', () => {
    const payload = {
      pseudo: 'yod',
      password: 'strongpassword',
    };

    const result = signinBodySchema.safeParse(payload);

    expect(result.success).toBe(false);
  });
});
