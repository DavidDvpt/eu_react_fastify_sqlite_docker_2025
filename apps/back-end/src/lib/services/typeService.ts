import { SortHelper } from '@eu/helpers';

import type { Type } from '#prisma/generated/client.js';
import type { TypeFormOutputBody, TypeDto } from '@eu/types';

import prismaClient from '#prisma/prismaClient.js';

export class TypeService {
  private static _client = prismaClient.type;
  constructor() {}

  static parser(row?: Type | null) {
    if (!row) return null;
    const parsed: TypeDto = {
      id: row.id,
      name: row.name,
      categoryId: row.category_id,
      isActive: row.is_active,
      userId: row.user_id,
      createdAt: row.date_created,
      updatedAt: row.date_updated ?? undefined,
    };

    return parsed;
  }
  static async getAll(userId: string, sort: keyof TypeDto) {
    const sortKey: keyof TypeDto = sort ?? 'name';
    const rows = await this._client.findMany({ where: { user_id: userId } });

    const parsed = rows.map((m) => this.parser(m)).filter((f) => f !== null);

    if (!parsed) return [] as TypeDto[];

    SortHelper.sortByKey(parsed ?? [], sortKey);

    return rows;
  }

  static async getById(id: string, userId: string) {
    const row = await this._client.findUnique({ where: { id, user_id: userId } });

    const parsed = this.parser(row);

    return parsed;
  }

  static async create(userId: string, data: Omit<TypeFormOutputBody, 'id'>) {
    const row = await this._client.create({
      data: {
        name: data.name,
        category_id: data.categoryId,
        is_active: true,
        is_stackable: data.isStackable ?? false,
        date_created: new Date().toISOString(),
        date_updated: null,
        user_id: userId,
      },
    });
    if (!row) return null;

    return { id: row.id };
  }

  static async update(id: string, userId: string, data: Partial<Omit<TypeFormOutputBody, 'id'>>) {
    const row = await this._client.update({
      where: { id, user_id: userId },
      data: {
        name: data.name,
        category_id: data.categoryId,
        is_active: true,
        is_stackable: data.isStackable,
        date_updated: new Date().toISOString(),
      },
    });

    if (!row) return null;

    return { id: row.id };
  }
}
