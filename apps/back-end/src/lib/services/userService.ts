import type { User } from '#prisma/generated/client.js';
import type { UserDto, UserSignUpFormOutputBody } from '@eu/types';

import prismaClient from '#prisma/prismaClient.js';

export class UserService {
  private static userParser(user: User | null) {
    if (!user) return null;
    const parsed: UserDto = {
      id: user.id,
      firstname: user.firstname ?? undefined,
      lastname: user.lastname ?? undefined,
      pseudo: user.pseudo,
      email: user.email,
      createdAt: user.date_created,
      updatedAt: user.date_updated ?? undefined,
      role: user.role,
      isActive: user.is_active,
      password: user.password_hash,
    };

    return parsed;
  }

  static async getbyId(userId: string) {
    const row = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    return this.userParser(row);
  }

  static async getByEmail(email: string) {
    const row = await prismaClient.user.findUnique({ where: { email } });

    return this.userParser(row);
  }

  static async getByPseudo(pseudo: string) {
    const row = await prismaClient.user.findUnique({ where: { pseudo } });

    return this.userParser(row);
  }

  static async create(body: Omit<UserSignUpFormOutputBody, 'id'>) {
    const parsed: Omit<User, 'id'> = {
      pseudo: body.pseudo,
      email: body.email,
      password_hash: body.password,
      firstname: body.firstname ?? null,
      lastname: body.lastname ?? null,
      role: 'USER',
      is_active: true,
      date_created: new Date().toISOString(),
      date_updated: null,
    };

    const row = await prismaClient.user.create({ data: parsed });

    return { id: row.id };
  }

  static async update(id: string, body: Partial<Omit<UserDto, 'id' | 'password'>>) {
    const parsed: Partial<Omit<User, 'id' | 'password_hash'>> = {
      pseudo: body.pseudo,
      email: body.email,
      firstname: body.firstname ?? null,
      lastname: body.lastname ?? null,
      is_active: body.isActive,
      date_updated: new Date().toISOString(),
    };

    const row = await prismaClient.user.update({ where: { id }, data: parsed });

    return { id: row.id };
  }
}
