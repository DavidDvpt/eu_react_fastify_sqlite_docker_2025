import { SortHelper } from '@eu/helpers';

import type { Item } from '#prisma/generated/client.js';
import type { RootDatabaseClient } from '#prisma/prismaClient.js';
import type { ItemFormOutputBody, ItemDto, SortOptions, ItemSortKey, LotSortKey } from '@eu/types';

import { StockService } from '#src/lib/services/domain/stockService.js';
import { LotService } from '#src/lib/services/prisma/lotService.js';

const NEGATIVE_STOCK_ERROR = (itemId: string) =>
  `Invariant violated: negative stock for item ${itemId}`;

export class ItemService {
  constructor(private readonly prisma: RootDatabaseClient) {}

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
    sort?: SortOptions<ItemSortKey>;
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

  async getById({
    id,
    userIds,
    includeLots,
    activeLotsOnly,
  }: {
    id: string;
    userIds?: string[];
    includeLots?: boolean;
    activeLotsOnly?: boolean;
  }) {
    const row = await this.prisma.item.findFirst({
      where: { id, user_id: { in: userIds } },
      include: {
        lots: includeLots
          ? {
              where: { is_active: activeLotsOnly },
            }
          : undefined,
      },
    });
    const parsed = this.parser(row);

    return parsed;
  }

  async getLots({
    userId,
    itemId,
    isActive,
    sort,
  }: {
    itemId: string;
    userId: string;
    isActive?: boolean;
    sort?: SortOptions<LotSortKey>;
  }) {
    const ls = new LotService(this.prisma);
    const lots = await ls.getAll({
      userId,
      itemId,
      isActive,
      sort,
    });

    return lots;
  }
  async getStock({ userId, itemId }: { itemId: string; userId: string }) {
    const ss = new StockService();

    const lots = await this.getLots({ userId, itemId });

    const stock = ss.getStockFromLots(lots);

    if (stock[itemId] < 0) {
      throw new Error(NEGATIVE_STOCK_ERROR(itemId));
    }

    return stock;
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
