import { Prisma } from '../../../prisma/generated/client.js';

import type { PrismaClient } from '../../../prisma/generated/client.js';

type PrismaLikeClient = PrismaClient | Prisma.TransactionClient;

export type StockByItemRow = {
  itemId: string;
  name: string;
  quantity: number;
  totalPrice: number;
};

export class LotStatsRepository {
  constructor(private readonly client: PrismaLikeClient) {}

  async getStock(userId: string): Promise<StockByItemRow[]> {
    const rows = await this.client.$queryRaw<
      Array<{
        item_id: string;
        name: string;
        quantity: Prisma.Decimal | number;
        total_price: Prisma.Decimal | number;
      }>
    >(
      Prisma.sql`
        SELECT
          i.id AS item_id,
          i.name,
          COALESCE(SUM(l.quantity_remaining), 0) AS quantity,
          COALESCE(SUM(l.quantity_remaining * i.value), 0) AS total_price
        FROM item i
        JOIN lot l ON l.item_id = i.id AND l.is_active = true
        WHERE l.user_id = ${userId}
          AND l.quantity_remaining > 0
        GROUP BY i.id, i.name
        ORDER BY i.name
      `
    );

    return rows.map((row) => ({
      itemId: row.item_id,
      name: row.name,
      quantity: typeof row.quantity === 'number' ? row.quantity : Number(row.quantity.toString()),
      totalPrice:
        typeof row.total_price === 'number' ? row.total_price : Number(row.total_price.toString()),
    }));
  }

  async getStockByItemId(userId: string, itemId: string): Promise<StockByItemRow | null> {
    const rows = await this.client.$queryRaw<
      Array<{
        item_id: string;
        name: string;
        quantity: Prisma.Decimal | number;
        total_price: Prisma.Decimal | number;
      }>
    >(
      Prisma.sql`
        SELECT
          i.id AS item_id,
          i.name,
          COALESCE(SUM(l.quantity_remaining), 0) AS quantity,
          COALESCE(SUM(l.quantity_remaining * i.value), 0) AS total_price
        FROM item i
        JOIN lot l ON l.item_id = i.id AND l.is_active = true
        WHERE l.user_id = ${userId}
          AND i.id = ${itemId}
          AND l.quantity_remaining > 0
        GROUP BY i.id, i.name
      `
    );

    const row = rows[0];
    if (!row) {
      return null;
    }

    return {
      itemId: row.item_id,
      name: row.name,
      quantity: typeof row.quantity === 'number' ? row.quantity : Number(row.quantity.toString()),
      totalPrice:
        typeof row.total_price === 'number' ? row.total_price : Number(row.total_price.toString()),
    };
  }
}
