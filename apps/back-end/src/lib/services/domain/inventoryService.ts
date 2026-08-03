import type { DatabaseClient } from '#prisma/prismaClient.js';
import type { StockService } from '#src/lib/services/domain/stockService.js';

import { LotService } from '#src/lib/services/prisma/lotService.js';

/**
 * Fournit des calculs de stock agrégés à partir des lots.
 */
export class InventoryService {
  constructor(
    private readonly prisma: DatabaseClient,
    private readonly stockService: StockService
  ) {}

  /**
   * Retourne les stocks actifs agrégés par item pour un utilisateur.
   */
  async getInventory({ userId, itemId }: { userId: string; itemId?: string }) {
    const ls = new LotService(this.prisma);
    const lots = await ls.getAll({
      userId,
      isActive: true,
      itemId,
      sort: { key: 'createdAt', order: 'asc' },
    });

    // const stocks = this.stockService.getStockFromLots(lots);

    return lots;
  }

  async getStock({ userId, itemId }: { userId: string; itemId?: string }) {
    const lots = await this.getInventory({
      userId,
      itemId,
    });

    const stocks = this.stockService.getStockFromLots(lots);

    return stocks;
  }
}
