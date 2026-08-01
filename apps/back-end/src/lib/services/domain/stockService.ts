import type { LotDto } from '@eu/types';

export class StockService {
  /**
   * Calcule le stock total restant pour une liste de lots appartenant au même item.
   */
  getStockFromLots(lots: LotDto[]) {
    return lots.reduce((s, c) => {
      return s + c.quantityRemaining;
    }, 0);
  }

  /**
   * Agrège les quantités restantes par `itemId` à partir d'une liste de lots.
   */
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
}
