import { SortHelper } from '@eu/helpers';

import prismaClient from '../../../prisma/prismaClient.js';

import type { Category } from '../../../prisma/generated/client.js';
// import type { CategoryDto, CategoryFormOutputBody } from '@eu/types';

export class CategoryService {
  private static _client: typeof prismaClient.category = prismaClient.category;

  constructor() {}

  private static parser(cat: Category) {
    const parsed: CategoryDto = {
      id: cat.id,
      name: cat.name,
      isActive: cat.is_active,
      userId: cat.user_id,
      createdAt: cat.date_created,
      updatedAt: cat.date_updated ?? undefined,
    };

    return parsed;
  }

  static async getAll(userId: string, sort?: keyof CategoryDto) {
    const sortKey: keyof CategoryDto = sort ?? 'name';

    const rows = await this._client.findMany({ where: { user_id: userId } });

    const parsed = rows.map((m) => this.parser(m));

    SortHelper.sortByKey(parsed, sortKey);

    return parsed;
  }

  static async getById(id: string, userId: string) {
    const category = await this._client.findUnique({ where: { id, user_id: userId } });

    if (!category) return null;

    return this.parser(category);
  }

  static async create(userId: string, data: Omit<CategoryFormOutputBody, 'id'>) {
    const cat = await this._client.create({
      data: {
        name: data.name,
        is_active: data.is_active ?? true,
        date_created: new Date().toISOString(),
        date_updated: null,
        user_id: userId,
      },
    });

    return { id: cat.id };
  }

  static async update(
    id: string,
    userId: string,
    data: Partial<Omit<CategoryFormOutputBody, 'id'>>
  ) {
    const cat = await this._client.update({
      where: { id, user_id: userId },
      data: { ...data, date_updated: new Date().toISOString() },
    });

    return { id: cat.id };
  }
}
