import type { DatabaseClient } from '#prisma/prismaClient.js';
import type { LotDto } from '@eu/types';

import { LotService } from '#src/lib/services/lotService.js';

const NEGATIVE_STOCK_ERROR = (itemId: string) =>
  `Invariant violated: negative stock for item ${itemId}`;

export class StockService {
  constructor(private readonly prisma: DatabaseClient) {}

  async getStockByItemId({ itemId, userId }: { itemId: string; userId: string }) {
    const ls = new LotService(this.prisma);
    const lots = await ls.getByItemId({
      userId,
      itemId,
      options: { isAvailableOnly: true },
    });

    const stock = this.getStockFromLots(lots);

    if (stock < 0) {
      throw new Error(NEGATIVE_STOCK_ERROR(itemId));
    }

    return stock;
  }

  getStockFromLots(lots: LotDto[]) {
    return lots.reduce((s, c) => {
      return s + c.quantityRemaining;
    }, 0);
  }
}
