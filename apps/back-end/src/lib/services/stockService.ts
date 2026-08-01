import type { DatabaseClient } from '#prisma/prismaClient.js';
import type { LotDto } from '@eu/types';

import { LotService } from '#src/lib/services/lotService.js';

const NEGATIVE_STOCK_ERROR = (itemId: string) =>
  `Invariant violated: negative stock for item ${itemId}`;

export class StockService {
  constructor(private readonly prisma: DatabaseClient) {}

  getStockFromLots(lots: LotDto[]) {
    return lots.reduce((s, c) => {
      return s + c.quantityRemaining;
    }, 0);
  }
  getStocksFromLots(lots: LotDto[]) {
    return lots.reduce(
      (s, c) => {
        if (!s[c.itemId]) {
          s[c.itemId] = c.quantityRemaining;
        } else {
          s[c.itemId] += c.quantityRemaining;
        }

        return s;

        // return s + c.quantityRemaining;
      },
      {} as Record<string, number>
    );
  }

  async getStockByItemId({ itemId, userId }: { itemId: string; userId: string }) {
    const ls = new LotService(this.prisma);
    const lots = await ls.getByItemId({
      userId,
      itemId,
      isActive: true,
    });

    const stock = this.getStockFromLots(lots);

    if (stock < 0) {
      throw new Error(NEGATIVE_STOCK_ERROR(itemId));
    }

    return stock;
  }
  async getStocksByItem({ userId }: { userId: string }) {
    const ls = new LotService(this.prisma);
    const lots = await ls.getAll({
      userId,
      isActive: true,
      sort: { key: 'createdAt', order: 'asc' },
    });

    const stocks = this.getStocksFromLots(lots);

    return stocks;
  }
}
