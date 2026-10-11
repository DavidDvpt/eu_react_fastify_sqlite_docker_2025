import { NumberHelper } from "./NumberHelper.js";
import type {
  RefinageOrigin,
  RefinageRecipeResponse,
} from "@/api/generated/react-query/model";

/**
 * Provenances proposées lors d'un raffinage depuis l'inventaire. `REFINING`
 * est intentionnellement exclu (un raffinage ne provient pas d'un autre
 * raffinage).
 */
export const REFINING_PROVENANCES = [
  "TRADE",
  "MINING",
  "CRAFTING",
] as const;
export type RefiningProvenance = (typeof REFINING_PROVENANCES)[number];

export type StockByItemId = Readonly<Record<string, number>>;

/** PPCM des quantités d'ingrédients de la recette (0 si aucune ligne). */
export function getRecipePpcm(
  ingredientLines: RefinageRecipeResponse[],
): number {
  if (ingredientLines.length === 0) return 0;

  return NumberHelper.lcm(
    ...ingredientLines.map((line) => line.quantity),
  );
}

/**
 * Nombre maximal de résultats pouvant être raffinés avec le stock disponible.
 * Le backend exige que `clickCount` (nombre de résultats) soit un multiple du
 * PPCM des quantités d'ingrédients, donc on retourne le plus grand multiple
 * du PPCM inférieur ou égal à la quantité que permet le stock
 * (`min_i floor(stock_i / quantity_i)`). Retourne 0 quand la recette n'est
 * pas faisable.
 */
export function computeRefinageMaxClickCount(
  ingredientLines: RefinageRecipeResponse[],
  stockByItemId: StockByItemId,
): number {
  const ppcm = getRecipePpcm(ingredientLines);
  if (ppcm === 0 || ingredientLines.length === 0) return 0;

  const maxByStock = ingredientLines.reduce(
    (min, line) =>
      Math.min(min, Math.floor((stockByItemId[line.origin] ?? 0) / line.quantity)),
    Infinity,
  );

  if (maxByStock < ppcm) return 0;

  return maxByStock - (maxByStock % ppcm);
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