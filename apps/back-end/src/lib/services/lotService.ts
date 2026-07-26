import type { Lot } from '#prisma/generated/client.js';
import type { GetLotsOptions, LotDto, LotFormOutputBody } from '@eu/types';

import { type DatabaseClient } from '#prisma/prismaClient.js';
import { StockService } from '#src/lib/services/stockService.js';

const STOCK_INSUFFISENT_AVAILABLE_QUANTITY = 'INSUFFISENT AVAILABLE QUANTITY';

export class LotService {
  constructor(private readonly prisma: DatabaseClient) {}

  private parsePrismaToDto(body: Lot) {
    const parsed: LotDto = {
      id: body.id,
      itemId: body.item_id,
      isActive: body.is_active,
      priceRemaining: body.price_remaining ?? 0,
      quantityExported: body.quantity_exported,
      quantityRemaining: body.quantity_remaining,
      lotType: body.lot_type,
      createdAt: body.date_created,
      updatedAt: body.date_updated ?? undefined,
    };

    return parsed;
  }
  private getStockFromLots(lots: LotDto[]) {
    return lots.reduce((stock, lot) => stock + lot.quantityRemaining, 0);
  }
  async getAll({ userId }: { userId: string }) {
    const rows = await this.prisma.lot.findMany({ where: { user_id: userId } });

    const parsed = rows.map((m) => this.parsePrismaToDto(m));

    return parsed;
  }
  async getById({ id, userId }: { id: string; userId: string }) {
    const row = await this.prisma.lot.findUnique({ where: { user_id: userId, id } });

    if (!row) return null;

    const parsed = this.parsePrismaToDto(row);

    return parsed;
  }
  async getByItemId({
    userId,
    itemId,
    options,
  }: {
    userId: string;
    itemId: string;
    options?: GetLotsOptions;
  }) {
    const rows = await this.prisma.lot.findMany({
      where: {
        user_id: userId,
        item_id: itemId,
        is_active: options?.isAvailableOnly ? true : undefined,
      },
      orderBy: options?.sort ? { [options.sort]: options.sortDirection ?? 'asc' } : undefined,
    });

    const parsed = rows.map((m) => this.parsePrismaToDto(m));

    return parsed;
  }
  async consumeQuantityOnLots({
    itemId,
    userId,
    quantity,
  }: {
    itemId: string;
    userId: string;
    quantity: number;
  }) {
    const lots = await this.getByItemId({
      userId,
      itemId,
      options: { isAvailableOnly: true, sort: 'date_created' },
    });

    const stock = this.getStockFromLots(lots);

    if (stock < quantity) throw new Error(STOCK_INSUFFISENT_AVAILABLE_QUANTITY);

    let remaining = quantity;
    const allocations: { lotId: string; quantity: number }[] = [];

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

    return allocations;
  }
  async create({ body, userId }: { userId: string; body: Omit<LotFormOutputBody, 'id'> }) {
    const row = await this.prisma.lot.create({
      data: {
        is_active: true,
        item_id: body.itemId,
        quantity_exported: body.quantityExported,
        quantity_remaining: body.quantityRemaining,
        price_remaining: body.priceRemaining,
        date_created: new Date().toISOString(),
        lot_type: body.lotType,
        user_id: userId,
      },
    });

    return { id: row.id };
  }
}
