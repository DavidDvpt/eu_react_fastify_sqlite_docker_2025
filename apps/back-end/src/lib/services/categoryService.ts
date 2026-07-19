import { SortHelper } from '@eu/helpers';

import prismaClient from '../../../prisma/prismaClient.js';

import type { Category } from '../../../prisma/generated/client.js';

export class CategoryService {
  private _client: typeof prismaClient.category;

  constructor() {
    this._client = prismaClient.category;
  }

  async getAll(userId: string, sort?: keyof Category) {
    const sortKey: keyof Category = sort ?? 'name';
    const rows = await this._client.findMany({ where: { user_id: userId } });

    return SortHelper.sortByKey(rows, sortKey);
  }

  async getById(id: string, userId: string) {
    return await this._client.findUnique({ where: { id, user_id: userId } });
  }

  async create(
    userId: string,
    data: {
      name: string;
      is_active?: boolean;
    }
  ) {
    const now = new Date().toISOString();

    return this._client.create({
      data: {
        name: data.name,
        is_active: data.is_active ?? true,
        date_created: now,
        date_updated: null,
        user_id: userId,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: {
      name?: string;
      is_active?: boolean;
    }
  ) {
    return this._client.update({
      where: { id, user_id: userId },
      data: { ...data, date_updated: new Date().toISOString() },
    });
  }
}
