import type { DatabaseClient } from '#prisma/prismaClient.js';
import type { StockService } from '#src/lib/services/domain/stockService.js';
import type { LotSortKey, SortOptions, TransactionTypeDto } from '@eu/types';

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
  async getLots({
    userId,
    isActive,
    sort,
    hasInitialValue,
  }: {
    userId: string;
    isActive?: boolean;
    sort?: SortOptions<LotSortKey>;
    hasInitialValue?: boolean;
  }) {
    const ls = new LotService(this.prisma);
    const lots = await ls.getAll({
      userId,
      isActive,
      sort: { key: sort?.key ?? 'createdAt', order: sort?.order },
      hasInitialValue,
    });

    return lots;
  }

  async getStocks({
    userId,
    isActive = true,
    sort,
  }: {
    userId: string;
    isActive?: boolean;
    sort?: SortOptions<LotSortKey>;
  }) {
    const lots = await this.getLots({
      userId,
      sort,
      isActive,
    });

    const stocks = this.stockService.getStockFromLots(lots);

    return stocks;
  }
}
