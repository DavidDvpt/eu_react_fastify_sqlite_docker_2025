import { SortHelper } from '@eu/helpers';

import type { Prisma } from '#prisma/generated/client.js';
import type { LotDto, LotFormBody, LotSortKey, SortOptions } from '@eu/types';

import { type DatabaseClient } from '#prisma/prismaClient.js';
import { lotWithTransactionLotsInclude, type LotWithLines } from '#src/types/prismaApi/lots.js';
const STOCK_INSUFFISENT_AVAILABLE_QUANTITY = 'INSUFFISENT AVAILABLE QUANTITY';

/**
 * Encapsule les opérations de lecture et de mutation sur les lots de stock.
 */
export class LotService {
  constructor(private readonly prisma: DatabaseClient) {}

  private async findLots({
    userId,
    isActive,
    itemId,
    sort,
    hasInitialValue,
  }: {
    userId: string;
    itemId?: string;
    isActive?: boolean;
    sort?: SortOptions<LotSortKey>;
    hasInitialValue?: boolean;
  }) {
    const rows = await this.prisma.lot.findMany({
      where: {
        user_id: userId,
        is_active: isActive,
        item_id: itemId,
      },
      include: hasInitialValue
        ? {
            transaction_lots: {
              where: {
                transaction: {
                  transaction_type: {
                    notIn: ['SELL'],
                  },
                },
              },
              select: { quantity: true },
            },
          }
        : undefined,
    });

    const parsed = rows.map((m) => this.parsePrismaToDto(m));

    SortHelper.sortByKey(parsed, sort?.key ?? 'createdAt', sort?.order);

    return parsed;
  }

  /**
   * Convertit un modèle Prisma `Lot` vers le DTO utilisé par l'application.
   */
  private parsePrismaToDto(
    body:
      | LotWithLines
      | Prisma.LotGetPayload<{
          include: undefined;
        }>
  ) {
    const parsed: LotDto = {
      id: body.id,
      itemId: body.item_id,
      isActive: body.is_active,
      priceRemaining: body.price_remaining ?? 0,
      quantityExported: body.quantity_exported ?? 0,
      quantityRemaining: body.quantity_remaining ?? 0,
      lotType: body.lot_type,
      createdAt: body.date_created,
      updatedAt: body.date_updated ?? null,
      initialQuantity:
        'transaction_lots' in body
          ? body.transaction_lots.reduce((total, line) => total + line.quantity, 0)
          : 0,
    };

    return parsed;
  }

  /**
   * Retourne tous les lots d'un utilisateur, avec filtrage optionnel sur l'état actif
   * et tri optionnel.
   */
  async getAll({
    userId,
    isActive,
    itemId,
    sort,
    hasInitialValue,
  }: {
    userId: string;
    itemId?: string;
    isActive?: boolean;
    sort?: SortOptions<LotSortKey>;
    hasInitialValue?: boolean;
  }) {
    const rows = await this.prisma.lot.findMany({
      where: {
        user_id: userId,
        is_active: isActive,
        item_id: itemId,
      },
      include: hasInitialValue
        ? {
            transaction_lots: {
              where: {
                transaction: {
                  transaction_type: {
                    notIn: ['SELL'],
                  },
                },
              },
              select: { quantity: true },
            },
          }
        : undefined,
    });

    const parsed = rows.map((m) => this.parsePrismaToDto(m));

    SortHelper.sortByKey(parsed, sort?.key ?? 'createdAt', sort?.order);

    return parsed;
  }

  /**
   * Retourne un lot par son identifiant pour un utilisateur donné.
   */
  async getById({ id, userId }: { id: string; userId: string }) {
    const row = await this.prisma.lot.findUnique({
      where: { user_id: userId, id },
      include: lotWithTransactionLotsInclude,
    });

    if (!row) return null;

    const parsed = this.parsePrismaToDto(row);

    return parsed;
  }

  /**
   * Retourne les lots rattachés à un item pour un utilisateur donné.
   */
  async getByItemId({
    userId,
    itemId,
    sort,
    isActive,
  }: {
    userId: string;
    itemId: string;
    isActive?: boolean;
    sort?: SortOptions<LotSortKey>;
  }) {
    const rows = await this.prisma.lot.findMany({
      where: {
        user_id: userId,
        item_id: itemId,
        is_active: isActive,
      },
      include: lotWithTransactionLotsInclude,
    });

    const parsed = rows.map((m) => this.parsePrismaToDto(m));

    SortHelper.sortByKey(parsed, sort?.key ?? 'createdAt', sort?.order);
    return parsed;
  }

  /**
   * Consomme une quantité sur les lots d'un item en parcourant les lots
   * dans l'ordre fourni par `sort`.
   *
   * Lève une erreur si la somme des quantités restantes sur les lots sélectionnés
   * est insuffisante pour couvrir la quantité demandée.
   */
  async consumeQuantityOnLots({
    itemId,
    userId,
    quantity,
    sort,
    isActive,
  }: {
    itemId: string;
    userId: string;
    quantity: number;
    sort?: SortOptions<LotSortKey>;
    isActive?: boolean;
  }) {
    const allocations: { lotId: string; quantity: number }[] = [];

    await this.prisma.$transaction(async (tx) => {
      let remaining = quantity;

      const lots = await this.getByItemId({
        userId,
        itemId,
        isActive,
        sort: sort ? { key: sort.key, order: sort.order } : undefined,
      });

      for (const lot of lots) {
        if (remaining === 0) break;

        const consumed = Math.min(lot.quantityRemaining, remaining);
        const nextQuantity = lot.quantityRemaining - consumed;

        await this.prisma.lot.update({
          where: {
            id: lot.id,
          },
          data: {
            quantity_remaining: nextQuantity,
            is_active: nextQuantity > 0,
          },
        });

        allocations.push({
          lotId: lot.id,
          quantity: consumed,
        });

        remaining -= consumed;
      }

      if (remaining > 0) throw new Error(STOCK_INSUFFISENT_AVAILABLE_QUANTITY);

      return allocations;
    });

    return allocations;
  }

  async remainingIncrement({
    userId,
    id,
    increment,
  }: {
    userId: string;
    id: string;
    increment: number;
  }) {
    const result = await this.prisma.lot.update({
      where: { user_id: userId, id },
      data: {
        quantity_remaining: { increment },
        date_updated: new Date().toISOString(),
        is_active: true,
      },
    });

    return { id: result.id };
  }

  /**
   * Crée un nouveau lot actif pour un utilisateur.
   */
  async create({ body, userId }: { userId: string; body: Omit<LotFormBody, 'id'> }) {
    const row = await this.prisma.lot.create({
      data: {
        is_active: true,
        item_id: body.itemId,
        quantity_exported: body.quantityExported,
        quantity_remaining: body.quantityRemaining,
        price_remaining: body.priceRemaining,
        lot_type: body.lotType,
        date_created: new Date().toISOString(),
        user_id: userId,
      },
    });

    return { id: row.id };
  }
}
