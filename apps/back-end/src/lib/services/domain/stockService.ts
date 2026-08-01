import type { LotDto } from '@eu/types';

export class StockService {
  /**
   * Agrège les quantités restantes par `itemId` à partir d'une liste de lots.
   */
  getStockFromLots(lots: LotDto[]) {
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
}
