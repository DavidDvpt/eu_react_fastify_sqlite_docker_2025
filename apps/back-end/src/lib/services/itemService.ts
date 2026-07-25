import { SortHelper } from '@eu/helpers';
import { itemFormSchema } from '@eu/zod-schemas';

import prismaClient from '../../../prisma/prismaClient.js';

import type { ItemFormBody } from '@eu/types';

export class ItemService {
  private _client: typeof prismaClient.item;
  constructor() {
    this._client = prismaClient.item;
  }

  async getAll(userId: string) {
    const rows = await this._client.findMany({ where: { user_id: userId } });

    SortHelper.sortByKey(rows, 'name');

    return rows;
  }

  async getById(id: string, userId: string) {
    return this._client.findUnique({ where: { id, user_id: userId } });
  }

  async create(data: ItemFormBody) {
    const now = new Date().toISOString();
    const parsedBody = itemFormSchema.parse(data);
    const body: ItemFormBody = { ...data, ...parsedBody };

    return this._client.create({
      data: {
        id: body.id,
        name: body.name,
        image_url_id: body.imageUrlId,
        value: body.value,
        is_limited: body.isLimited ?? false,
        is_stackable: body.isStackable ?? true,
        item_type_id: body.typeId,
        is_active: body.isActive ?? true,
        date_created: now,
        date_updated: null,
        user_id: body.userId,
      },
    });
  }

  async update(data: Partial<ItemFormBody>) {
    return this._client.update({
      where: { id: data.id, user_id: data.userId },
      data: { ...data, date_updated: new Date().toISOString() },
    });
  }
}
