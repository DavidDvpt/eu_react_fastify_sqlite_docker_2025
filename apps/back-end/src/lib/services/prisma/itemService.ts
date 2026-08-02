import { SortHelper } from '@eu/helpers';

import { type DatabaseClient } from '../../../../prisma/prismaClient.js';

import type { Item } from '#prisma/generated/client.js';
import type { ItemFormOutputBody, ItemDto, SortOptions } from '@eu/types';

export class ItemService {
  constructor(private readonly prisma: DatabaseClient) {}

  parser(row: Item | null) {
    if (!row) return null;

    const parsed: ItemDto = {
      id: row.id,
      name: row.name,
      imageUrlId: row.image_url_id,
      isActive: row.is_active,
      isLimited: row.is_limited,
      userId: row.user_id,
      createdAt: row.date_created,
      updatedAt: row.date_updated,
      typeId: row.type_id,
      value: Number(row.value),
    };

    return parsed;
  }

  async getAll({
    userIds,
    isActive,
    typeId,
    sort,
  }: {
    userIds?: string[];
    sort?: SortOptions<ItemDto>;
    typeId?: string;
    isActive?: boolean;
  }) {
    const sortKey = sort?.key ?? 'name';
    const rows = await this.prisma.item.findMany({
      where: {
        user_id: { in: userIds },
        item_type_id: typeId,
        is_active: isActive,
      },
    });
    const parsed = rows.map((m) => this.parser(m)).filter((f) => f !== null);
    SortHelper.sortByKey(parsed, sortKey, sort?.order);

    return parsed;
  }

  async getById({ id, userIds }: { id: string; userIds?: string[] }) {
    const row = await this.prisma.item.findFirst({
      where: { id, user_id: { in: userIds } },
    });

    const parsed = this.parser(row);

    return parsed;
  }

  async create({ body, userId }: { userId: string; body: ItemFormOutputBody }) {
    const row = await this.prisma.item.create({
      data: {
        name: body.name,
        image_url_id: body.imageUrlId,
        value: body.value,
        is_limited: body.isLimited ?? false,
        type_id: body.typeId,
        is_active: body.isActive ?? true,
        date_created: new Date().toISOString(),
        date_updated: null,
        user_id: userId,
      },
    });

    return { id: row.id };
  }

  async update({
    body,
    id,
    userId,
  }: {
    id: string;
    userId: string;
    body: Partial<ItemFormOutputBody>;
  }) {
    const row = await this.prisma.item.update({
      where: { id, user_id: userId },
      data: {
        name: body.name,
        image_url_id: body.imageUrlId,
        value: body.value,
        is_limited: body.isLimited,
        type_id: body.typeId,
        is_active: body.isActive,
        date_updated: new Date().toISOString(),
      },
    });

    return { id: row.id };
  }
}
