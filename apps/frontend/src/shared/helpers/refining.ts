import { NumberHelper } from './NumberHelper.js';
import type {
  RefinageOriginStockResponse,
  RefinageRecipeResponse,
  SessionLineCostCreate,
} from '@/api/generated/react-query/model';

export type RefinageOrigin = { origin: string; quantity: number };

/**
 * Provenances proposées lors d'un raffinage depuis l'inventaire. `REFINING`
 * est intentionnellement exclu (un raffinage ne provient pas d'un autre
 * raffinage).
 */
export const REFINING_PROVENANCES = ['TRADE', 'MINING', 'CRAFTING'] as const;
export type RefiningProvenance = (typeof REFINING_PROVENANCES)[number];

export type StockByItemId = Readonly<Record<string, number>>;

/** PPCM des quantités d'ingrédients de la recette (0 si aucune ligne). */
export function getRecipePpcm(
  ingredientLines: RefinageRecipeResponse[],
): number {
  if (ingredientLines.length === 0) return 0;

  return NumberHelper.lcm(...ingredientLines.map((line) => line.quantity));
}

/**
 * Nombre maximal de résultats pouvant être raffinés avec le stock disponible.
 * Chaque ligne de recette décrit la quantité d'ingrédient nécessaire pour un
 * résultat : `min_i floor(stock_i / quantity_i)`.
 */
export function computeRefinageMaxClickCount(
  ingredientLines: RefinageRecipeResponse[],
  stockByItemId: StockByItemId,
): number {
  if (ingredientLines.length === 0) return 0;

  const maxByStock = ingredientLines.reduce(
    (min, line) =>
      Math.min(
        min,
        Math.floor((stockByItemId[line.origin] ?? 0) / line.quantity),
      ),
    Infinity,
  );

  return Number.isFinite(maxByStock) ? maxByStock : 0;
}

export function computeRefinageMaxClickCountFromOriginStock(
  originStocks: RefinageOriginStockResponse[],
): number {
  if (originStocks.length === 0) return 0;

  const maxByStock = originStocks.reduce(
    (min, stock) =>
      stock.quantityRequired > 0
        ? Math.min(
            min,
            Math.floor(stock.quantityAvailable / stock.quantityRequired),
          )
        : min,
    Infinity,
  );

  return Number.isFinite(maxByStock) ? maxByStock : 0;
}

/** Recette faisable si un raffinage valide (multiple du PPCM) est possible. */
export function isRecipeRefinable(
  ingredientLines: RefinageRecipeResponse[],
  stockByItemId: StockByItemId,
): boolean {
  return computeRefinageMaxClickCount(ingredientLines, stockByItemId) > 0;
}

/**
 * Lignes d'ingrédients du POST `/refinage/create` : les ids et quantités de
 * base des recettes. L'API s'en sert pour recalculer le PPCM et vérifier que
 * `clickCount` en est un multiple.
 */
export function buildRefinageOriginPayload(
  ingredientLines: RefinageRecipeResponse[],
): RefinageOrigin[] {
  return ingredientLines.map((line) => ({
    origin: line.origin,
    quantity: line.quantity,
  }));
}

/** Répartit les quantités nécessaires sur les lots que le backend doit débiter. */
export function buildRefinageCosts(
  originStocks: RefinageOriginStockResponse[],
  clickCount: number,
): SessionLineCostCreate[] {
  return originStocks.flatMap((stock) => {
    let remaining = stock.quantityRequired * clickCount;

    return stock.lots.flatMap((lot) => {
      if (remaining <= 0) return [];

      const quantity = Math.min(remaining, lot.quantityRemaining);
      remaining -= quantity;
      return quantity > 0 ? [{ lotId: lot.lotId, quantity }] : [];
    });
  });
}
