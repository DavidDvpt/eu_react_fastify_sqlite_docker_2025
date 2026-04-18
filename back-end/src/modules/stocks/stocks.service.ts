import type { LotStockRepository } from '../../lib/repositories/index.js';
import type { StockByItemRow, StockItemDetails } from '../../types/index.js';

class StocksService {
  constructor(private readonly lotStockRepository: LotStockRepository) {}

  list(userId: string): Promise<StockByItemRow[]> {
    return this.lotStockRepository.getStock(userId);
  }

  getByItemId(userId: string, itemId: string): Promise<StockByItemRow | null> {
    return this.lotStockRepository.getStockByItemId(userId, itemId);
  }

  getDetailsByItemId(userId: string, itemId: string): Promise<StockItemDetails | null> {
    return this.lotStockRepository.getStockDetailsByItemId(userId, itemId);
  }
}

export { StocksService };

