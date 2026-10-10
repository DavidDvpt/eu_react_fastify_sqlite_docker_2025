export function feeCalculation(markup: number) {
  if (markup <= 0) return 0.5;

  const value = (99.5 * markup + 995) / (markup + 1990);

  if (value >= 100) return 100;
  return Math.floor(value * 100) / 100;
}

export function sanitizeQuantity(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 1) {
    return 1;
  }
  return Math.floor(value);
}

export function sanitizeNonNegative(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return 0;
  }
  return value;
}

/** Max number of decimals allowed for a TTC in Free (non-auction) mode. */
export const FREE_TTC_MAX_DECIMALS = 5;
const FREE_TTC_FACTOR = 10 ** FREE_TTC_MAX_DECIMALS;

/**
 * Whether a value holds at most 5 decimals (Free mode TTC).
 * Works in integer space to avoid float pitfalls.
 */
export function hasMaxFreeDecimals(value: number): boolean {
  if (typeof value !== "number" || !Number.isFinite(value)) return false;
  return Math.abs(Math.round(value * FREE_TTC_FACTOR) - value * FREE_TTC_FACTOR) < 1e-6;
}

/**
 * Bulk purchase eligibility for non-stackable items.
 * Currently open to every item type; restrict here later
 * (e.g. by item type name/category) when needed.
 */
export function canBuyMultipleLots(): boolean {
  return true;
}

/**
 * Tolerant decimal parsing for text inputs: accepts both "12.5" and
 * "12,5" (native number inputs reject the "wrong" separator depending
 * on the browser locale). Non-parseable values map to 0.
 */
export function parseDecimalInput(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === "string") {
    const normalized = value.trim().replace(",", ".");
    if (normalized === "") return 0;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

/**
 * Pre-validation normalization for zod: turns comma decimals into dots
 * so `z.coerce.number()` accepts them. Empty values pass through
 * untouched (field-level preprocessors map them to defaults).
 */
export function normalizeDecimalInput(value: unknown): unknown {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return value;
    return trimmed.replace(",", ".");
  }
  return value;
}

function computeFeeFromTtc(tt: number, ttc: number) {
  return feeCalculation(ttc - tt);
}

export function getMinimumTtcWithFee(tt: number, initialTtc: number) {
  const safeInitialTtc = Number.isFinite(initialTtc) ? initialTtc : tt;
  let ttc = Math.max(Math.ceil(tt), Math.ceil(safeInitialTtc));
  let fee = computeFeeFromTtc(tt, ttc);

  while (tt + fee > ttc) {
    ttc += 1;
    fee = computeFeeFromTtc(tt, ttc);
  }

  return { ttc, fee };
}

export function getMinimumBuyTtc(tt: number, fee: number, initialTtc?: number) {
  const base =
    typeof initialTtc === "number" && Number.isFinite(initialTtc)
      ? initialTtc
      : tt;
  const minByInputs = Math.max(tt + fee, base);
  return Math.ceil(minByInputs);
}
