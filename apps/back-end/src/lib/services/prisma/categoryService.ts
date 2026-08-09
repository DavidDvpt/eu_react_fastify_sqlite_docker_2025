import { SortHelper } from '@eu/helpers';

import type { Category } from '#prisma/generated/client.js';
import type { DatabaseClient } from '#prisma/prismaClient.js';
import type { CategoryDto, CategoryFormBody, CategorySortKey, SortOptions } from '@eu/types';

export class CategoryService {
  constructor(private readonly prisma: DatabaseClient) {}

  private parser(cat: Category) {
    const parsed: CategoryDto = {
      id: cat.id,
      name: cat.name,
      isActive: cat.is_active,
      userId: cat.user_id,
      createdAt: cat.date_created,
      updatedAt: cat.date_updated,
    };

    return parsed;
  }

  async getAll({
    userIds,
    sort,
    isActive,
  }: {
    userIds?: string[];
    sort?: SortOptions<CategorySortKey>;
    isActive?: boolean;
  }) {
    const sortKey = sort?.key ?? 'name';
    const rows = await this.prisma.category.findMany({
      where: { user_id: { in: userIds }, is_active: isActive },
    });
    const parsed = rows.map((m) => this.parser(m));

    SortHelper.sortByKey(parsed, sortKey, sort?.order);

    return parsed;
  }
  async getById({ id, userIds }: { id: string; userIds?: string[] }) {
    const category = await this.prisma.category.findFirst({
      where: { id, user_id: { in: userIds }, is_active: true },
    });

    if (!category) return null;

    return this.parser(category);
  }

  async create({ body, userId }: { userId: string; body: CategoryFormBody }) {
    const { name, isActive } = body;

    const cat = await this.prisma.category.create({
      data: {
        name,
        is_active: isActive,
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
    body: Partial<CategoryFormBody>;
  }) {
    const cat = await this.prisma.category.update({
      where: { id, user_id: userId },
      data: { ...body, date_updated: new Date().toISOString() },
    });

    return { id: cat.id };
  }
}
