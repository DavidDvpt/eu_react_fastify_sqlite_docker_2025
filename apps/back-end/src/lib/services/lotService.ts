import type { Lot } from '#prisma/generated/client.js';
import type { LotDto, LotFormOutputBody } from '@eu/types';

import { type DatabaseClient } from '#prisma/prismaClient.js';

export class LotService {
  constructor(private readonly prisma: DatabaseClient) {}

  private parser(body: Lot) {
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
  async getAll({ userId }: { userId: string }) {
    const rows = await this.prisma.lot.findMany({ where: { user_id: userId } });

    if (!rows) return null;
    const parsed = rows.map((m) => this.parser(m));

    return parsed;
  }
  async getById({ id, userId }: { id: string; userId: string }) {
    const row = await this.prisma.lot.findUnique({ where: { user_id: userId, id } });

    if (!row) return null;

    const parsed = this.parser(row);

    return parsed;
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

  async update({
    body,
    id,
    userId,
  }: {
    id: string;
    userId: string;
    body: Partial<Omit<LotFormOutputBody, 'id'>>;
  }) {
    const row = await this.prisma.lot.update({
      where: { id, user_id: userId },
      data: {
        is_active: body.isActive,
        quantity_exported: body.quantityExported,
        quantity_remaining: body.quantityRemaining,
        price_remaining: body.priceRemaining,
        date_updated: new Date().toISOString(),
      },
    });

    return { id: row.id };
  }
}
