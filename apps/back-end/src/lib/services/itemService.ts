import { SortHelper } from '@eu/helpers';

import prismaClient from '../../../prisma/prismaClient.js';

import type { Item } from '#prisma/generated/client.js';
import type { ItemFormOutputBody, ItemDto } from '@eu/types';

export class ItemService {
  private static _client = prismaClient.item;

  constructor() {}

  static parser(row: Item | null) {
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
      typeId: row.item_type_id,
      value: Number(row.value),
    };

    return parsed;
  }

  static async getAll(userId: string, sort?: keyof ItemDto) {
    const sortKey = sort ?? 'name';
    const rows = await this._client.findMany({ where: { user_id: userId } });
    const parsed = rows.map((m) => this.parser(m)).filter((f) => f !== null);
    SortHelper.sortByKey(parsed, sortKey);

    return rows;
  }

  static async getById(id: string, userId: string) {
    const row = await this._client.findUnique({ where: { id, user_id: userId } });

    const parsed = this.parser(row);

    return parsed;
  }

  static async create(userId: string, body: ItemFormOutputBody) {
    const row = await this._client.create({
      data: {
        name: body.name,
        image_url_id: body.imageUrlId,
        value: body.value,
        is_limited: body.isLimited ?? false,
        item_type_id: body.typeId,
        is_active: body.isActive ?? true,
        date_created: new Date().toISOString(),
        date_updated: null,
        user_id: userId,
      },
    });

    return { id: row.id };
  }

  static async update(id: string, userId: string, data: Partial<ItemFormOutputBody>) {
    const row = await this._client.update({
      where: { id, user_id: userId },
      data: {
        name: data.name,
        image_url_id: data.imageUrlId,
        value: data.value,
        is_limited: data.isLimited,
        item_type_id: data.typeId,
        is_active: data.isActive,
        date_updated: new Date().toISOString(),
      },
    });

    return { id: row.id };
  }
}
