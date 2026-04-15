import { Prisma } from '../../../prisma/generated/client.js';

import type { PrismaClient } from '../../../prisma/generated/client.js';

type PrismaLikeClient = PrismaClient | Prisma.TransactionClient;

export type StockByItemRow = {
  itemId: string;
  imageUrlId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

export type StockLotInRow = {
  id: string;
  lotType: string;
  quantityRemaining: number;
  quantityInitial: number;
  quantityExported: number;
  priceRemaining: number;
  dateCreated: string;
};

export type StockLotOutRow = {
  id: string;
  dateCreated: string;
  quantity: number;
  tt: number;
  ttc: number;
  saleStatus: string | null;
};

export type StockItemDetails = {
  itemId: string;
  imageUrlId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  lotsIn: StockLotInRow[];
  lotsOut: StockLotOutRow[];
};

export class LotStockRepository {
  constructor(private readonly client: PrismaLikeClient) {}

  async getStock(userId: string): Promise<StockByItemRow[]> {
    const rows = await this.client.$queryRaw<
      Array<{
        item_id: string;
        image_url_id: string;
        name: string;
        unit_price: Prisma.Decimal | number;
        quantity: Prisma.Decimal | number;
        total_price: Prisma.Decimal | number;
      }>
    >(
      Prisma.sql`
        SELECT
          i.id AS item_id,
          i.image_url_id,
          i.name,
          i.value AS unit_price,
          COALESCE(SUM(l.quantity_remaining), 0) AS quantity,
          COALESCE(SUM(l.quantity_remaining * i.value), 0) AS total_price
        FROM item i
        JOIN lot l ON l.item_id = i.id AND l.is_active = true
        WHERE l.user_id = ${userId}
          AND l.quantity_remaining > 0
        GROUP BY i.id, i.image_url_id, i.name, i.value
        ORDER BY i.name
      `
    );

    return rows.map((row) => ({
      itemId: row.item_id,
      imageUrlId: row.image_url_id,
      name: row.name,
      unitPrice: typeof row.unit_price === 'number' ? row.unit_price : Number(row.unit_price.toString()),
      quantity: typeof row.quantity === 'number' ? row.quantity : Number(row.quantity.toString()),
      totalPrice:
        typeof row.total_price === 'number' ? row.total_price : Number(row.total_price.toString()),
    }));
  }

  async getStockByItemId(userId: string, itemId: string): Promise<StockByItemRow | null> {
    const rows = await this.client.$queryRaw<
      Array<{
        item_id: string;
        image_url_id: string;
        name: string;
        unit_price: Prisma.Decimal | number;
        quantity: Prisma.Decimal | number;
        total_price: Prisma.Decimal | number;
      }>
    >(
      Prisma.sql`
        SELECT
          i.id AS item_id,
          i.image_url_id,
          i.name,
          i.value AS unit_price,
          COALESCE(SUM(l.quantity_remaining), 0) AS quantity,
          COALESCE(SUM(l.quantity_remaining * i.value), 0) AS total_price
        FROM item i
        JOIN lot l ON l.item_id = i.id AND l.is_active = true
        WHERE l.user_id = ${userId}
          AND i.id = ${itemId}
          AND l.quantity_remaining > 0
        GROUP BY i.id, i.image_url_id, i.name, i.value
      `
    );

    const row = rows[0];
    if (!row) {
      return null;
    }

    return {
      itemId: row.item_id,
      imageUrlId: row.image_url_id,
      name: row.name,
      unitPrice: typeof row.unit_price === 'number' ? row.unit_price : Number(row.unit_price.toString()),
      quantity: typeof row.quantity === 'number' ? row.quantity : Number(row.quantity.toString()),
      totalPrice:
        typeof row.total_price === 'number' ? row.total_price : Number(row.total_price.toString()),
    };
  }

  async getStockDetailsByItemId(userId: string, itemId: string): Promise<StockItemDetails | null> {
    const stockRow = await this.getStockByItemId(userId, itemId);
    if (!stockRow) {
      return null;
    }

    const lotsInRows = await this.client.$queryRaw<
      Array<{
        id: string;
        lot_type: string;
        quantity_remaining: number;
        quantity_initial: number;
        quantity_exported: number;
        price_remaining: string;
        date_created: string;
      }>
    >(
      Prisma.sql`
        SELECT
          l.id,
          l.lot_type,
          l.quantity_remaining,
          COALESCE(sl_in.quantity, l.quantity_remaining + l.quantity_exported) AS quantity_initial,
          l.quantity_exported,
          l.price_remaining,
          l.date_created
        FROM lot l
        LEFT JOIN LATERAL (
          SELECT sl.quantity
          FROM session_line sl
          WHERE sl.inventory_lot_id = l.id
            AND sl.user_id = ${userId}
            AND sl.item_id = ${itemId}
            AND sl.line_type = 'IN'
          ORDER BY sl.id ASC
          LIMIT 1
        ) sl_in ON TRUE
        WHERE l.user_id = ${userId}
          AND l.item_id = ${itemId}
          AND l.is_active = true
        ORDER BY l.date_created DESC
      `
    );

    const lotsOutRows = await this.client.$queryRaw<
      Array<{
        id: string;
        date_created: string | null;
        quantity: number;
        tt: Prisma.Decimal | number;
        ttc: Prisma.Decimal | number;
        sale_status: string | null;
      }>
    >(
      Prisma.sql`
        SELECT
          sl.id,
          l.date_created,
          sl.quantity,
          sl.tt,
          sl.ttc,
          sl.sale_status
        FROM session_line sl
        LEFT JOIN lot l ON l.id = sl.inventory_lot_id
        WHERE sl.user_id = ${userId}
          AND sl.item_id = ${itemId}
          AND sl.line_type = 'OUT'
        ORDER BY sl.id DESC
      `
    );

    return {
      ...stockRow,
      lotsIn: lotsInRows.map((row) => ({
        id: row.id,
        lotType: row.lot_type,
        quantityRemaining: row.quantity_remaining,
        quantityInitial: row.quantity_initial,
        quantityExported: row.quantity_exported,
        priceRemaining: Number(row.price_remaining),
        dateCreated: row.date_created,
      })),
      lotsOut: lotsOutRows.map((row) => ({
        id: row.id,
        dateCreated: row.date_created ?? '',
        quantity: row.quantity,
        tt: typeof row.tt === 'number' ? row.tt : Number(row.tt.toString()),
        ttc: typeof row.ttc === 'number' ? row.ttc : Number(row.ttc.toString()),
        saleStatus: row.sale_status,
      })),
    };
  }
}
