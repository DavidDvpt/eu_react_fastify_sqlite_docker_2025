import type { LotStockRepository } from '../../lib/repositories/index.js';
import type {
  SellableLotRow,
  StockAvailabilityRow,
  StockByItemRow,
  StockItemDetails,
} from '../../types/index.js';

class StocksService {
  constructor(private readonly lotStockRepository: LotStockRepository) {}

  async list(userId: string): Promise<StockByItemRow[]> {
    const rows = await this.lotStockRepository.getStock(userId);
    return rows;
  }

  async getByItemId(userId: string, itemId: string): Promise<StockByItemRow | null> {
    const row = await this.lotStockRepository.getStockByItemId(userId, itemId);
    return row;
  }

  async getDetailsByItemId(userId: string, itemId: string): Promise<StockItemDetails | null> {
    const details = await this.lotStockRepository.getStockDetailsByItemId(userId, itemId);
    return details;
  }

  async getAvailableStockByItemIds(
    userId: string,
    itemIds: string[]
  ): Promise<StockAvailabilityRow[]> {
    const rows = await this.lotStockRepository.getAvailableStockByItemIds(userId, itemIds);
    return rows;
  }

  async getAvailableLotsFifoByItemId(userId: string, itemId: string): Promise<SellableLotRow[]> {
    const rows = await this.lotStockRepository.getAvailableLotsFifoByItemId(userId, itemId);
    return rows;
  }

  async getSellableLotById(userId: string, lotId: string): Promise<SellableLotRow | null> {
    const lot = await this.lotStockRepository.getSellableLotById(userId, lotId);
    return lot;
  }
}

export { StocksService };
