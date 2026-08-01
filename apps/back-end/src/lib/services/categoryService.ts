import { SortHelper } from '@eu/helpers';

import { type DatabaseClient } from '../../../prisma/prismaClient.js';

import type { Category } from '../../../prisma/generated/client.js';
import type { CategoryDto, CategoryFormOutputBody } from '@eu/types';

export class CategoryService {
  constructor(private readonly prisma: DatabaseClient) {}

  private parser(cat: Category) {
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

  async getAll({
    userId,
    sort,
    isActive,
  }: {
    userId: string;
    sort?: keyof CategoryDto;
    isActive?: boolean;
  }) {
    const sortKey: keyof CategoryDto = sort ?? 'name';
    const rows = await this.prisma.category.findMany({
      where: { user_id: userId, is_active: isActive },
    });
    const parsed = rows.map((m) => this.parser(m));
    SortHelper.sortByKey(parsed, sortKey);

    return parsed;
  }

  async getById({ id, userId }: { id: string; userId: string }) {
    const category = await this.prisma.category.findUnique({ where: { id, user_id: userId } });

    if (!category) return null;

    return this.parser(category);
  }

  async create({ body, userId }: { userId: string; body: Omit<CategoryFormOutputBody, 'id'> }) {
    const cat = await this.prisma.category.create({
      data: {
        name: body.name,
        is_active: body.is_active ?? true,
        date_created: new Date().toISOString(),
        date_updated: null,
        user_id: userId,
      },
    });

    return { id: cat.id };
  }

  async update({
    body,
    id,
    userId,
  }: {
    id: string;
    userId: string;
    body: Partial<Omit<CategoryFormOutputBody, 'id'>>;
  }) {
    const cat = await this.prisma.category.update({
      where: { id, user_id: userId },
      data: { ...body, date_updated: new Date().toISOString() },
    });

    return { id: cat.id };
  }
}
