import type { DatabaseClient } from '#prisma/prismaClient.js';
import type { StockService } from '#src/lib/services/domain/stockService.js';

import { LotService } from '#src/lib/services/prisma/lotService.js';

const NEGATIVE_STOCK_ERROR = (itemId: string) =>
  `Invariant violated: negative stock for item ${itemId}`;

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
      sort: { key: 'date_created', order: 'asc' },
    });

    const stocks = this.stockService.getStockFromLots(lots);

    return stocks;
  }

  async getInventoryLotsByItemId({
    itemId,
    userId,
    isActive,
  }: {
    itemId: string;
    userId: string;
    isActive: boolean;
  }) {
    const ls = new LotService(this.prisma);
    const lots = await ls.getByItemId({
      userId,
      itemId,
      isActive: isActive,
      sort: { key: 'date_created', order: 'asc' },
    });

    return lots;
  }

  /**
   * Retourne le stock actif disponible pour un item donné.
   *
   * Lève une erreur si un stock négatif est détecté, ce qui indique une incohérence
   * de données.
   */
  async getInventoryByItemId({ itemId, userId }: { itemId: string; userId: string }) {
    const lots = await this.getInventoryLotsByItemId({
      userId,
      itemId,
      isActive: true,
    });

    const stock = this.stockService.getStockFromLots(lots);

    if (stock[itemId] < 0) {
      throw new Error(NEGATIVE_STOCK_ERROR(itemId));
    }

    return stock;
  }
}
