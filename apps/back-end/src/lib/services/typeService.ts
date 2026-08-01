import { SortHelper } from '@eu/helpers';

import type { Type } from '#prisma/generated/client.js';
import type { TypeFormOutputBody, TypeDto } from '@eu/types';

import { type DatabaseClient } from '#prisma/prismaClient.js';

export class TypeService {
  constructor(private readonly prisma: DatabaseClient) {}

  parser(row?: Type | null) {
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
  async getAll({
    userId,
    sort,
    isActive,
    categoryId,
  }: {
    userId: string;
    sort?: keyof TypeDto;
    isActive?: boolean;
    categoryId?: string;
  }) {
    const sortKey: keyof TypeDto = sort ?? 'name';
    const rows = await this.prisma.type.findMany({
      where: { user_id: userId, is_active: isActive, category_id: categoryId },
    });

    const parsed = rows.map((m) => this.parser(m)).filter((f) => f !== null);

    if (!parsed) return [] as TypeDto[];

    SortHelper.sortByKey(parsed ?? [], sortKey);

    return rows;
  }

  async getById({ id, userId }: { id: string; userId: string }) {
    const row = await this.prisma.type.findUnique({ where: { id, user_id: userId } });

    const parsed = this.parser(row);

    return parsed;
  }

  async create({ body, userId }: { userId: string; body: Omit<TypeFormOutputBody, 'id'> }) {
    const row = await this.prisma.type.create({
      data: {
        name: body.name,
        category_id: body.categoryId,
        is_active: true,
        is_stackable: body.isStackable ?? false,
        date_created: new Date().toISOString(),
        date_updated: null,
        user_id: userId,
      },
    });

    return { id: row.id };
  }

  async update({
    id,
    userId,
    body,
  }: {
    id: string;
    userId: string;
    body: Partial<Omit<TypeFormOutputBody, 'id'>>;
  }) {
    const row = await this.prisma.type.update({
      where: { id, user_id: userId },
      data: {
        name: body.name,
        category_id: body.categoryId,
        is_active: true,
        is_stackable: body.isStackable,
        date_updated: new Date().toISOString(),
      },
    });

    if (!row) return null;

    return { id: row.id };
  }
}
