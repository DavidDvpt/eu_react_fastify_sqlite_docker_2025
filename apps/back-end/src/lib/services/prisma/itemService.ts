import { SortHelper } from '@eu/helpers';
import { itemDtoSchema } from '@eu/zod-schemas';

import type { Item, Prisma } from '#prisma/generated/client.js';
import type { DatabaseClient } from '#prisma/prismaClient.js';
import type {
  ItemFormBody,
  ItemDto,
  SortOptions,
  ItemSortKeys,
  LotSortKey,
  ItemDetailEnum,
  ItemFormBodyWithId,
} from '@eu/types';

import { StockService } from '#src/lib/services/domain/stockService.js';
import { LotService } from '#src/lib/services/prisma/lotService.js';

const NEGATIVE_STOCK_ERROR = (itemId: string) =>
  `Invariant violated: negative stock for item ${itemId}`;

export class ItemService {
  constructor(protected readonly prisma: DatabaseClient) {}

  protected parsedToDto(row: Item | null): ItemDto | null {
    if (!row) return null;

    const parsed = {
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
      isRare: row.is_rare ?? null,
      isUntradeable: row.is_untradeable ?? null,
      description: row.description ?? null,
      decay: row.decay ? Number(row.decay) : null,
      weight: row.weight ? Number(row.weight) : null,
      nexusId: row.nexus_id ?? null,
    };

    const validated = itemDtoSchema.parse(parsed);

    return validated;
  }

  private parserToPrisma({
    body,
    userId,
  }: {
    body: ItemFormBody;
    userId: string;
  }): Prisma.ItemUncheckedCreateInput {
    return {
      name: body.name,
      image_url_id: body.imageUrlId ?? '',
      value: body.value,
      is_limited: body.isLimited ?? false,
      type_id: body.typeId,
      is_active: body.isActive ?? true,
      nexus_id: body.nexusId,
      description: body.description,
      weight: body.weight,
      decay: body.decay,
      is_untradeable: body.isUntradeable,
      is_rare: body.isRare,
      date_created: new Date().toISOString(),
      date_updated: null,
      user_id: userId,
    };
  }

  private parserToPrismaUpdate(body: Partial<ItemFormBody>): Prisma.ItemUncheckedUpdateInput {
    const isLimited =
      body.isLimited === null || body.isLimited === undefined ? undefined : body.isLimited;
    return {
      name: body.name,
      image_url_id: body.imageUrlId ?? undefined,
      value: body.value,
      is_limited: isLimited,
      type_id: body.typeId,
      is_active: body.isActive,
      nexus_id: body.nexusId,
      description: body.description,
      weight: body.weight,
      decay: body.decay,
      is_untradeable: body.isUntradeable,
      is_rare: body.isRare,
      date_updated: new Date().toISOString(),
    };
  }

  async getAll({
    isActive,
    typeId,
    sort,
    details,
  }: {
    sort?: SortOptions<ItemSortKeys>;
    typeId?: string;
    isActive?: boolean;
    details?: ItemDetailEnum;
  } = {}) {
    const rows = await this.prisma.item.findMany({
      where: {
        type_id: typeId,
        is_active: isActive,
      },
      include: details ? { [details]: true } : undefined,
    });

    const parsed = rows.map((m) => this.parsedToDto(m)).filter((f) => f !== null);

    SortHelper.sortByKey(parsed, sort?.key ?? 'name', sort?.order);

    return parsed;
  }
  async getById({
    id,
    userIds: _userIds,
    includeLots,
    activeLotsOnly,
  }: {
    id: string;
    userIds?: string[];
    includeLots?: boolean;
    activeLotsOnly?: boolean;
  }) {
    const row = await this.prisma.item.findFirst({
      where: { id, is_active: true },
      include: {
        lots: includeLots
          ? {
              where: { is_active: activeLotsOnly },
            }
          : undefined,
      },
    });
    const parsed = this.parsedToDto(row);

    return parsed;
  }

  async groupByType({ noImage }: { noImage?: boolean } = {}) {
    try {
      const result = await this.prisma.item.groupBy({
        by: ['type_id'],
        _count: { _all: true },
        where: noImage ? { image_url_id: '' } : undefined,
      });

      const groups: Record<string, number> = {};
      result.forEach((e) => {
        const key = e.type_id;
        const count = e._count._all;

        groups[key] = count;
      });

      return groups;
    } catch (error) {
      console.log(error);
    }
  }
  async getLots({
    userId,
    itemId,
    isActive,
    sort,
    hasInitialValue,
  }: {
    itemId: string;
    userId: string;
    isActive?: boolean;
    sort?: SortOptions<LotSortKey>;
    hasInitialValue?: boolean;
  }) {
    const ls = new LotService(this.prisma);
    const lots = await ls.getAll({
      userId,
      itemId,
      isActive,
      sort,
      hasInitialValue,
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
  async create({ body, userId }: { userId: string; body: ItemFormBody }) {
    const row = await this.prisma.item.create({
      data: this.parserToPrisma({ body, userId }),
    });

    return { id: row.id };
  }

  async createWithId({ body, userId }: { userId: string; body: ItemFormBodyWithId }) {
    const row = await this.prisma.item.create({
      data: {
        ...this.parserToPrisma({ body, userId }),
        id: body.id,
      },
    });

    return { id: row.id };
  }

  async createMany({ body, userId }: { userId: string; body: ItemFormBody[] }) {
    return this.prisma.item.createMany({
      data: body.map((item) => this.parserToPrisma({ body: item, userId })),
    });
  }

  async update({ body, id, userId }: { id: string; userId: string; body: Partial<ItemFormBody> }) {
    const row = await this.prisma.item.update({
      where: { id, user_id: userId },
      data: this.parserToPrismaUpdate(body),
    });

    return { id: row.id };
  }
}
