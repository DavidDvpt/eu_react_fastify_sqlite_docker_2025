/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as argon2 from 'argon2';
import Fastify from 'fastify';
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import authRoutes from '../authRoutes.js';

const userMock = {
  id: 'user-1',
  pseudo: 'test',
  email: 'test@example.com',
  role: Role.USER,
  date_created: new Date().toISOString(),
  is_active: true,
  password_hash: 'password123',
  firstname: null,
  lastname: null,
  date_updated: null,
};

vi.mock('argon2', () => ({
  default: {
    hash: vi.fn(() => Promise.resolve('hashed-password')),
  },
}));

// ⬇️ tes types réels (adapte les chemins)
import type { ItemCategoryRepository } from '../../lib/repositories/itemCategoryRepository.js';
import type { ItemRepository } from '../../lib/repositories/itemRepository.js';
import type { ItemTypeRepository } from '../../lib/repositories/itemTypeRepository.js';
import type { UserRepository } from '../../lib/repositories/userRepository.js';

import type { FastifyInstance } from 'fastify';
import { Role } from '../../../prisma/generated/enums.js';

describe('authRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function buildAuthTestApp() {
    const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    // ✅ IMPORTANT : on crée des vi.fn() typées EXACTEMENT comme les méthodes du repo
    type FindUniqueSig = UserRepository['findUnique'];
    type CreateSig = UserRepository['create'];

    const findUnique = vi.fn<FindUniqueSig>();
    const create = vi.fn<CreateSig>();

    // users repo mock (contient des vi.fn(), donc mockResolvedValueOnce existe)
    const usersRepoMock = { findUnique, create } as Pick<UserRepository, 'findUnique' | 'create'>;

    // stubs pour satisfaire le type complet de app.repos (tu n’en as pas besoin ici)
    const reposMock = {
      users: usersRepoMock as unknown as UserRepository,
      itemCategories: {} as ItemCategoryRepository,
      itemTypes: {} as ItemTypeRepository,
      items: {} as ItemRepository,
    };

    type JwtDecorator = FastifyInstance['jwt'];
    type SignSig = JwtDecorator['sign'];

    const sign = vi.fn<SignSig>(() => 'fake.jwt.token');
    // jwt mock : pareil, on met un vi.fn typé

    const jwtMock = { sign } as unknown as Pick<JwtDecorator, 'sign'>;

    // decorate (test-only cast acceptable)

    app.decorate('repos', reposMock as any);
    app.decorate('jwt', jwtMock as any);

    app.register(authRoutes, { prefix: '/auth' });

    return { app, usersRepo: usersRepoMock, jwt: jwtMock };
  }

  it('POST /auth/signup -> 201', async () => {
    const { app, usersRepo, jwt } = buildAuthTestApp();

    // ✅ Use vi.mocked so ESLint/TS know it’s a mock function
    vi.mocked(usersRepo.findUnique).mockResolvedValueOnce(null);
    vi.mocked(usersRepo.create).mockResolvedValueOnce(userMock);

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

    // ✅ argon2 mock propre (pas de any)
    expect((argon2 as any).default.hash).toHaveBeenCalledWith('password123');

    expect(jwt.sign).toHaveBeenCalledWith({ sub: 'user-1', role: 'USER' });

    await app.close();
  });
});
