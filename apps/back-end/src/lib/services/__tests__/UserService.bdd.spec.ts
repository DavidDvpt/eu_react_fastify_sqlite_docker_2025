import { afterAll, describe, expect, it } from 'vitest';

import prismaClient from '../../../../prisma/prismaClient.js';
import { UserService } from '../userService.js';

import { usersMock } from './mock.js';

const prisma = prismaClient;
const service = new UserService(prismaClient);

afterAll(async () => {
  await prisma.$disconnect();
});

describe('UserService', () => {
  it('creates and reads a user by email and pseudo', async () => {
    const payload = usersMock()[0];
    const created = await service.create({
      body: {
        firstname: payload.firstname,
        lastname: payload.lastname,
        pseudo: payload.pseudo,
        email: payload.email,
        password: payload.password_hash,
      },
    });
    const foundByEmail = await service.getByEmail({ email: payload.email });
    const foundByPseudo = await service.getByPseudo({ pseudo: payload.pseudo });

    expect(foundByEmail?.id).toBe(created.id);
    expect(foundByPseudo?.id).toBe(created.id);
    expect(foundByEmail?.email).toBe(payload.email);
  });

  it('updates a user', async () => {
    const payload = usersMock()[1];
    const created = await service.create({
      body: {
        firstname: payload.firstname,
        lastname: payload.lastname,
        pseudo: payload.pseudo,
        email: payload.email,
        password: payload.password_hash,
      },
    });
    await service.update({
      id: created.id,
      body: {
        firstname: payload.firstname,
        lastname: 'Updated',
        pseudo: payload.pseudo,
        email: payload.email,
        isActive: true,
        role: 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: undefined,
      },
    });
    const found = await service.getByEmail({ email: payload.email });

    expect(found?.id).toBe(created.id);
    expect(found?.lastname).toBe('Updated');
  });
});
