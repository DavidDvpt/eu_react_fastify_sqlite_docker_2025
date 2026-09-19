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
