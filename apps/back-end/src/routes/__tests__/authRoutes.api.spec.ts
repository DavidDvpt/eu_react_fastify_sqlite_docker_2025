/* eslint-disable @typescript-eslint/no-explicit-any */
import cookie from '@fastify/cookie';
import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_API_PREFIX, AUTH_PREFIX } from '../../config/routes.js';
import HashTools from '../../lib/security/HashTools.js';
import authPlugin from '../../plugins/authPlugin.js';
import authRoutes from '../authRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

const userServiceMocks = {
  getByEmail: vi.fn(),
  getByPseudo: vi.fn(),
  create: vi.fn(),
  getbyId: vi.fn(),
};

vi.mock('argon2', () => ({
  default: {
    hash: vi.fn(async () => 'hashed-password'),
  },
}));

vi.mock('../../lib/services/prisma/userService.js', () => ({
  UserService: vi.fn(function MockUserService() {
    return userServiceMocks;
  }),
}));

describe('authRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  function createBaseApp() {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.register(cookie);

    app.decorate('jwt', {
      access: { sign: vi.fn(() => 'access.jwt') },
      refresh: { sign: vi.fn(() => 'refresh.jwt') },
    } as any);

    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role: 'USER', pseudo: 'test' };
      });
    });

    return app;
  }

  function buildApp() {
    const app = createBaseApp();
    app.register(authRoutes, { prefix: AUTH_PREFIX });
    return app;
  }

  function buildAuthPluginApp() {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.register(cookie);
    app.register(authPlugin);
    app.register(authRoutes, { prefix: AUTH_PREFIX });
    return app;
  }

  it('POST /auth/signup creates a user and returns 201', async () => {
    const app = buildApp();
    vi.mocked(userServiceMocks.getByEmail).mockResolvedValueOnce(null as never);
    vi.mocked(userServiceMocks.getByPseudo).mockResolvedValueOnce(null as never);
    vi.mocked(userServiceMocks.create).mockResolvedValueOnce({ id: 'user-1' } as never);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${AUTH_PREFIX}/signup`,
      payload: {
        pseudo: 'test',
        email: 'test@example.com',
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(201);
    expect(userServiceMocks.getByEmail).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(userServiceMocks.getByPseudo).toHaveBeenCalledWith({ pseudo: 'test' });
    expect(userServiceMocks.create).toHaveBeenCalledWith({
      body: {
        email: 'test@example.com',
        pseudo: 'test',
        firstname: undefined,
        lastname: undefined,
        password: 'hashed-password',
      },
    });
    expect(res.json()).toEqual({ message: 'User created' });
    await app.close();
  });

  it('POST /auth/signup returns 409 when email already exists', async () => {
    const app = buildApp();
    vi.mocked(userServiceMocks.getByEmail).mockResolvedValueOnce({ id: 'user-1' } as never);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${AUTH_PREFIX}/signup`,
      payload: {
        pseudo: 'test',
        email: 'test@example.com',
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(409);
    expect(res.json()).toEqual({ message: 'Email already in use' });
    await app.close();
  });

  it('POST /auth/signin returns 200 and auth cookies when credentials are valid', async () => {
    const app = buildApp();
    vi.mocked(userServiceMocks.getByPseudo).mockResolvedValueOnce({
      id: 'user-1',
      pseudo: 'test',
      role: 'USER',
      password: 'stored-hash',
      isActive: true,
    } as never);
    vi.spyOn(HashTools, 'verifyPassword').mockResolvedValueOnce(true);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${AUTH_PREFIX}/signin`,
      payload: {
        pseudo: 'testuser',
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ message: 'Success' });
    expect(res.cookies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'access_token',
          value: 'access.jwt',
          path: '/',
          httpOnly: true,
        }),
        expect.objectContaining({
          name: 'refresh_token',
          value: 'refresh.jwt',
          path: AUTH_API_PREFIX,
          httpOnly: true,
        }),
      ])
    );
    await app.close();
  });

  it('POST /auth/signin returns 401 when user is deactivated', async () => {
    const app = buildApp();
    vi.mocked(userServiceMocks.getByPseudo).mockResolvedValueOnce({
      id: 'user-1',
      pseudo: 'testuser',
      role: 'USER',
      password: 'stored-hash',
      isActive: false,
    } as never);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${AUTH_PREFIX}/signin`,
      payload: {
        pseudo: 'testuser',
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(401);
    expect(res.json()).toEqual({ message: 'utilisateur desactivé' });
    await app.close();
  });

  it('POST /auth/logout clears auth cookies and returns 200', async () => {
    const app = buildApp();

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${AUTH_PREFIX}/logout`,
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
          path: AUTH_API_PREFIX,
        }),
      ])
    );
    await app.close();
  });

  it('POST /auth/signin returns 401 when pseudo is invalid', async () => {
    const app = buildApp();
    vi.mocked(userServiceMocks.getByPseudo).mockResolvedValueOnce(null as never);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${AUTH_PREFIX}/signin`,
      payload: {
        pseudo: 'testuser',
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(401);
    expect(res.json()).toEqual({ message: 'Identifiants invalides' });
    await app.close();
  });

  it('POST /auth/signin returns 401 when password is invalid', async () => {
    const app = buildApp();
    vi.mocked(userServiceMocks.getByPseudo).mockResolvedValueOnce({
      id: 'user-1',
      pseudo: 'testuser',
      role: 'USER',
      password: 'stored-hash',
      isActive: true,
    } as never);
    vi.spyOn(HashTools, 'verifyPassword').mockResolvedValueOnce(false);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${AUTH_PREFIX}/signin`,
      payload: {
        pseudo: 'testuser',
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(401);
    expect(res.json()).toEqual({ message: 'Identifiants invalides' });
    await app.close();
  });

  it('GET /auth/me returns the authenticated user', async () => {
    const app = buildApp();
    vi.mocked(userServiceMocks.getbyId).mockResolvedValueOnce({
      id: 'user-1',
      role: 'USER',
      pseudo: 'test',
    } as never);

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${AUTH_PREFIX}/me`,
    });

    expect(res.statusCode).toBe(200);
    expect(userServiceMocks.getbyId).toHaveBeenCalledWith({ id: 'user-1' });
    expect(res.json()).toEqual({
      id: 'user-1',
      role: 'USER',
      pseudo: 'test',
    });
    await app.close();
  });

  it('GET /auth/me returns 401 when the user is not found', async () => {
    const app = buildApp();
    vi.mocked(userServiceMocks.getbyId).mockResolvedValueOnce(null as never);

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${AUTH_PREFIX}/me`,
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toBe('Unauthorized');
    await app.close();
  });

  it('GET /auth/me returns 401 when the access token cookie is invalid', async () => {
    const app = buildAuthPluginApp();

    await app.ready();
    const res = await app.inject({
      method: 'GET',
      url: `${AUTH_PREFIX}/me`,
      headers: {
        cookie: 'access_token=not-a-jwt',
      },
    });

    expect(res.statusCode).toBe(401);
    expect(res.json()).toEqual({ message: 'Unauthorized' });
    await app.close();
  });
});
