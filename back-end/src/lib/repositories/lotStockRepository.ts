import {
  getSellableLotsFifoByItemIdSql,
  getLotsInByItemIdSql,
  getLotsOutByItemIdSql,
  getSellableLotByIdSql,
  getInventoryByItemIdSql,
  getInventoryByItemIdsSql,
  getInventorySql,
} from './lotStockRepository.sqlraw.js';

import type { Prisma } from '../../../prisma/generated/client.js';
import type {
  PrismaLikeClient,
  SellableLotRow,
  StockAvailabilityRow,
  InventoryByItemRow,
  InventoryItemDetails,
} from '../../types/index.js';

export class LotStockRepository {
  constructor(private readonly client: PrismaLikeClient) {}

  async getStock(userId: string): Promise<InventoryByItemRow[]> {
    const rows = await this.client.$queryRaw<
      Array<{
        item_id: string;
        image_url_id: string;
        name: string;
        unit_price: Prisma.Decimal | number;
        quantity: Prisma.Decimal | number;
        total_price: Prisma.Decimal | number;
      }>
    >(getInventorySql(userId));

    return rows.map((row) => ({
      itemId: row.item_id,
      imageUrlId: row.image_url_id,
      name: row.name,
      unitPrice:
        typeof row.unit_price === 'number' ? row.unit_price : Number(row.unit_price.toString()),
      quantity: typeof row.quantity === 'number' ? row.quantity : Number(row.quantity.toString()),
      totalPrice:
        typeof row.total_price === 'number' ? row.total_price : Number(row.total_price.toString()),
    }));
  }

  async getStockByItemId(userId: string, itemId: string): Promise<InventoryByItemRow | null> {
    const rows = await this.client.$queryRaw<
      Array<{
        item_id: string;
        image_url_id: string;
        name: string;
        unit_price: Prisma.Decimal | number;
        quantity: Prisma.Decimal | number;
        total_price: Prisma.Decimal | number;
      }>
    >(getInventoryByItemIdSql(userId, itemId));

    const row = rows[0];
    if (!row) {
      return null;
    }

    return {
      itemId: row.item_id,
      imageUrlId: row.image_url_id,
      name: row.name,
      unitPrice:
        typeof row.unit_price === 'number' ? row.unit_price : Number(row.unit_price.toString()),
      quantity: typeof row.quantity === 'number' ? row.quantity : Number(row.quantity.toString()),
      totalPrice:
        typeof row.total_price === 'number' ? row.total_price : Number(row.total_price.toString()),
    };
  }

  async getStockDetailsByItemId(
    userId: string,
    itemId: string
  ): Promise<InventoryItemDetails | null> {
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
        session_status: 'OPENNED' | 'CLOSED' | 'ARCHIVED';
        line_status: 'OPENNED' | 'CLOSED' | 'ARCHIVED';
        quantity_exported: number;
        price_remaining: string;
        date_created: string;
      }>
    >(getLotsInByItemIdSql(userId, itemId));

    const lotsOutRows = await this.client.$queryRaw<
      Array<{
        id: string;
        date_created: string | null;
        quantity: number;
        line_status: 'OPENNED' | 'CLOSED' | 'ARCHIVED';
        session_status: 'OPENNED' | 'CLOSED' | 'ARCHIVED';
        tt: Prisma.Decimal | number;
        ttc: Prisma.Decimal | number;
        sale_status: string | null;
      }>
    >(getLotsOutByItemIdSql(userId, itemId));

    return {
      ...stockRow,
      lotsIn: lotsInRows.map((row) => ({
        id: row.id,
        lotType: row.lot_type,
        quantityRemaining: row.quantity_remaining,
        quantityInitial: row.quantity_initial,
        sessionStatus: row.session_status,
        lineStatus: row.line_status,
        quantityExported: row.quantity_exported,
        priceRemaining: Number(row.price_remaining),
        dateCreated: row.date_created,
      })),
      lotsOut: lotsOutRows.map((row) => ({
        id: row.id,
        dateCreated: row.date_created ?? '',
        quantity: row.quantity,
        lineStatus: row.line_status,
        sessionStatus: row.session_status,
        tt: typeof row.tt === 'number' ? row.tt : Number(row.tt.toString()),
        ttc: typeof row.ttc === 'number' ? row.ttc : Number(row.ttc.toString()),
        saleStatus: row.sale_status,
      })),
    };
  }

  async getAvailableStockByItemIds(
    userId: string,
    itemIds: string[]
  ): Promise<StockAvailabilityRow[]> {
    if (!itemIds.length) {
      return [];
    }

    const rows = await this.client.$queryRaw<
      Array<{
        item_id: string;
        quantity: Prisma.Decimal | number;
        total_price: Prisma.Decimal | number;
      }>
    >(getInventoryByItemIdsSql(userId, itemIds));

    return rows.map((row) => ({
      itemId: row.item_id,
      availableQuantity:
        typeof row.quantity === 'number' ? row.quantity : Number(row.quantity.toString()),
    }));
  }

  async getAvailableLotsFifoByItemId(userId: string, itemId: string): Promise<SellableLotRow[]> {
    const rows = await this.client.$queryRaw<
      Array<{
        id: string;
        item_id: string;
        quantity_remaining: number;
        quantity_exported: number;
        price_remaining: string;
        date_created: string;
      }>
    >(getSellableLotsFifoByItemIdSql(userId, itemId));

    return rows.map((row) => ({
      id: row.id,
      itemId: row.item_id,
      quantityRemaining: row.quantity_remaining,
      quantityExported: row.quantity_exported,
      priceRemaining: Number(row.price_remaining),
      dateCreated: row.date_created,
    }));
  }

  async getSellableLotById(userId: string, lotId: string): Promise<SellableLotRow | null> {
    const rows = await this.client.$queryRaw<
      Array<{
        id: string;
        item_id: string;
        quantity_remaining: number;
        quantity_exported: number;
        price_remaining: string;
        date_created: string;
      }>
    >(getSellableLotByIdSql(userId, lotId));

    const row = rows[0];
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      itemId: row.item_id,
      quantityRemaining: row.quantity_remaining,
      quantityExported: row.quantity_exported,
      priceRemaining: Number(row.price_remaining),
      dateCreated: row.date_created,
    };
  }
}
