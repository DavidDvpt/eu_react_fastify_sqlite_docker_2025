import { SortHelper } from '@eu/helpers';
import prismaClient from 'prisma/prismaClient.js';

import type { TypeDto } from '../../../../../packages/types/src/type.js';
import type { TypeFormOutputBody, TypeDto } from '@eu/types';

export class TypeService {
  private static _client = prismaClient.type;
  constructor() {}

  static async getAll(userId: string, sortKey: keyof TypeDto) {
    const sortKey: keyof TypeDto = sort ?? 'name';
    const rows = await this._client.findMany({ where: { user_id: userId } });

    SortHelper.sortByKey(rows, sortKey);

    return rows;
  }

  static async getById(id: string, userId: string) {
    return this._client.findUnique({ where: { id, user_id: userId } });
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
      data: { ...data, date_updated: new Date().toISOString() },
    });

    if (!row) return null;

    return { id: row.id };
  }
}
