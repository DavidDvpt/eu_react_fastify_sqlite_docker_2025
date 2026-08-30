import { SortHelper } from '@eu/helpers';

import type { Type } from '#prisma/generated/client.js';
import type { TypeFormBody, TypeDto, SortOptions, TypeSortKey } from '@eu/types';

import { type DatabaseClient } from '#prisma/prismaClient.js';

export class TypeService {
  constructor(private readonly prisma: DatabaseClient) {}

  parsePrismaToDto(row?: Type | null) {
    if (!row) return null;
    const parsed: TypeDto = {
      id: row.id,
      name: row.name,
      categoryId: row.category_id,
      isStackable: row.is_stackable,
      isActive: row.is_active,
      userId: row.user_id,
      createdAt: row.date_created,
      updatedAt: row.date_updated,
    };

    return parsed;
  }

  async count() {
    const result = await this.prisma.type.aggregate({ _count: true });

    return { count: result._count };
  }

  async getAll({
    sort,
    isActive,
    categoryId,
  }: {
    sort?: SortOptions<TypeSortKey>;
    isActive?: boolean;
    categoryId?: string;
  } = {}) {
    const rows = await this.prisma.type.findMany({
      where: {
        is_active: isActive,
        category_id: categoryId,
      },
    });

    const parsed = rows.map((m) => this.parsePrismaToDto(m)).filter((f) => f !== null);

    SortHelper.sortByKey(parsed ?? [], sort?.key ?? 'name', sort?.order);

    return parsed;
  }
  async getById({ id, userIds: _userIds }: { id: string; userIds?: string[] }) {
    const row = await this.prisma.type.findFirst({
      where: { id, is_active: true },
    });

    const parsed = this.parsePrismaToDto(row);

    return parsed;
  }

  async create({ body, userId }: { userId: string; body: Omit<TypeFormBody, 'id'> }) {
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
  async isTypeExists({
    id,
    name,
    userIds: _userIds,
  }: {
    id?: string;
    name?: string;
    userIds: string[];
  }) {
    if (!id && !name) {
      return false;
    }

    const type = await this.prisma.type.findFirst({
      where: {
        id,
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    return Boolean(type);
  }

  async update({
    id,
    userId,
    body,
  }: {
    id: string;
    userId: string;
    body: Partial<Omit<TypeFormBody, 'id'>>;
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
