/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as argon2 from 'argon2';
import Fastify from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import cookie from '@fastify/cookie';
import authRoutes from '../authRoutes.js';
import type { FastifyInstance } from 'fastify';
import { Role } from '../../../prisma/generated/enums.js';
import type { UserForToken } from '../../types/fastify.js';
import HashTools from '../../lib/security/HashTools.js';
import authPlugin from '../../plugins/authPlugin.js';
import repositoryPlugin from '../../plugins/repositories.js';

const meUserMock: UserForToken = {
  id: 'user-1',
  pseudo: 'test',
  role: Role.USER,
};

const loginMock = {
  ...meUserMock,
  password_hash: 'stored-hash',
  is_active: true,
};

const createdUserMock = {
  ...meUserMock,
  email: 'test@example.com',
};

vi.mock('argon2', () => ({
  default: {
    hash: vi.fn(() => Promise.resolve('hashed-password')),
  },
}));

describe('authRoutes', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function createBaseApp() {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.register(cookie);

    // repos minimal
    const usersRepo = { findUnique: vi.fn(), create: vi.fn() };
    app.decorate('repos', { users: usersRepo } as any);

    // jwt minimal compatible signup+signin
    const jwt = {
      sign: vi.fn(() => 'fake.jwt.token'),
      access: { sign: vi.fn(() => 'access.jwt') },
      refresh: { sign: vi.fn(() => 'refresh.jwt') },
    };
    app.decorate('jwt', jwt as any);
    // app.register(repositoryPlugin);
    // eslint-disable-next-line @typescript-eslint/require-await
    app.decorate('authenticate', async (request: any) => {
      request.user = { id: 'user-1', role: Role.USER, pseudo: 'test' };
    });

    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role: Role.USER, pseudo: 'test' };
      });
    });

    return { app, usersRepo, jwt };
  }

  function buildSignupApp() {
    const { app, usersRepo, jwt } = createBaseApp();
    app.register(authRoutes, { prefix: '/auth' });
    return { app, usersRepo, jwt };
  }

  function buildSigninApp() {
    const { app, usersRepo, jwt } = createBaseApp();
    app.register(authRoutes, { prefix: '/auth' });
    return { app, usersRepo, jwt };
  }

  function buildMeApp() {
    const { app, usersRepo, jwt } = createBaseApp();

    app.register(authRoutes, { prefix: '/auth' });
    return { app, usersRepo, jwt };
  }

  function buildLogoutApp() {
    const { app, usersRepo, jwt } = createBaseApp();
    app.register(authRoutes, { prefix: '/auth' });
    return { app, usersRepo, jwt };
  }

  function buildMeIntegrationApp() {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.register(cookie);

    app.register(authPlugin); // <-- celui qui decorate protect + jwtVerify
    app.register(authRoutes, { prefix: '/auth' });

    return { app };
  }

  it('POST /auth/signup -> should be ok, return 201', async () => {
    const { app, usersRepo, jwt } = buildSignupApp();

    vi.mocked(usersRepo.findUnique).mockResolvedValueOnce(null);
    vi.mocked(usersRepo.create).mockResolvedValueOnce(createdUserMock as any);

    await app.ready();

    const res = await app.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        pseudo: 'test',
        email: 'test@example.com',
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(201);
    expect(res.json()).toEqual({
      message: 'User created',
    });

    // ✅ argon2 mock propre (pas de any)
    expect((argon2 as any).default.hash).toHaveBeenCalledWith('password123');

    expect(jwt.access.sign).not.toHaveBeenCalled();

    await app.close();
  });
  it('POST /auth/signup -> allready exists => 409', async () => {
    const { app, usersRepo } = buildSignupApp();

    vi.mocked(usersRepo.findUnique).mockResolvedValueOnce(meUserMock as any);
    vi.mocked(usersRepo.create).mockResolvedValueOnce(createdUserMock as any);

    await app.ready();

    const res = await app.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        pseudo: 'test',
        email: 'test@example.com',
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(409);

    await app.close();
  });

  it('POST /auth/signin -> should be ok, return 200', async () => {
    const { app, usersRepo } = buildSigninApp();

    vi.mocked(usersRepo.findUnique).mockResolvedValueOnce(loginMock as any);
    vi.spyOn(HashTools, 'verifyPassword').mockResolvedValueOnce(true as any);

    await app.ready();

    const res = await app.inject({
      method: 'POST',
      url: '/auth/signin',
      payload: {
        pseudo: 'test',
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.cookies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'access_token',
          value: 'access.jwt',
          maxAge: 24 * 60 * 60,
          path: '/',
          httpOnly: true,
        }),
        expect.objectContaining({
          name: 'refresh_token',
          value: 'refresh.jwt',
          maxAge: 7 * 24 * 60 * 60,
          path: '/auth',
          httpOnly: true,
        }),
      ])
    );

    await app.close();
  });
  it('POST /auth/signin -> user desactivated, return 401', async () => {
    const { app, usersRepo } = buildSigninApp();

    vi.mocked(usersRepo.findUnique).mockResolvedValueOnce({
      ...loginMock,
      is_active: false,
    } as any);

    await app.ready();

    const res = await app.inject({
      method: 'POST',
      url: '/auth/signin',
      payload: {
        pseudo: 'test',
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(401);
    expect(res.statusMessage).toBe('Unauthorized');

    await app.close();
  });

  it('POST /auth/logout -> clears auth cookies and returns 200', async () => {
    const { app } = buildLogoutApp();

    await app.ready();

    const res = await app.inject({
      method: 'POST',
      url: '/auth/logout',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ message: 'Logged out' });
    expect(res.cookies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'access_token',
          value: '',
          path: '/',
        }),
        expect.objectContaining({
          name: 'refresh_token',
          value: '',
          path: '/auth',
        }),
      ])
    );

    await app.close();
  });
  it('POST /auth/signin -> pseudo invalid return 401', async () => {
    const { app, usersRepo } = buildSigninApp();

    vi.mocked(usersRepo.findUnique).mockResolvedValueOnce(null);

    await app.ready();

    const res = await app.inject({
      method: 'POST',
      url: '/auth/signin',
      payload: {
        pseudo: 'test',
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(401);

    await app.close();
  });
  it('POST /auth/signin -> password invalid return 401', async () => {
    const { app } = buildSigninApp();

    await app.ready();

    vi.spyOn(app.repos.users, 'findUnique').mockResolvedValueOnce(loginMock as any);
    vi.spyOn(HashTools, 'verifyPassword').mockResolvedValueOnce(false as any);

    const res = await app.inject({
      method: 'POST',
      url: '/auth/signin',
      payload: {
        pseudo: 'test',
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(401);

    await app.close();
  });

  it('GET /me -> should be authenticated return 200', async () => {
    const { app, usersRepo } = buildMeApp();

    vi.mocked(usersRepo.findUnique).mockResolvedValueOnce(meUserMock as any);

    await app.ready();

    const res = await app.inject({
      method: 'GET',
      url: '/auth/me',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      id: 'user-1',
      role: Role.USER,
      pseudo: 'test',
    });

    // vérifie qu'on a bien fetch avec l'id issu du token (sub)
    expect(usersRepo.findUnique).toHaveBeenCalledWith({ where: { id: 'user-1' } });

    await app.close();
  });
  it('GET /me -> user not fould should return 401', async () => {
    const { app, usersRepo } = buildMeApp();

    vi.mocked(usersRepo.findUnique).mockResolvedValueOnce(null);

    await app.ready();

    const res = await app.inject({
      method: 'GET',
      url: '/auth/me',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toBe('Unauthorized');

    await app.close();
  });
  it('GET /me -> no cookie found should return 401', async () => {
    const { app } = buildMeIntegrationApp();

    await app.ready();

    const res = await app.inject({
      method: 'GET',
      url: '/auth/me',
      headers: {
        cookie: 'access_token=not-a-jwt',
      },
    });

    expect(res.statusCode).toBe(401);
    expect(res.json()).toEqual({ message: 'Unauthorized' });

    await app.close();
  });
});
