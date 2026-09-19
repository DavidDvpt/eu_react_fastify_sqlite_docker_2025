import {
  getMinimumBuyTtc,
  getMinimumTtcWithFee,
  sanitizeNonNegative,
} from "@/shared/helpers/transactionHelpers";
import type {
  TransactionPricingInput,
  TransactionPricingValues,
} from "@/shared/types";

function sanitizeEditableQuantity(value: number) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return Math.floor(value);
}

export function computeQuantityPricing({
  action,
  fee,
  quantity,
  ttc,
  unitPrice,
}: TransactionPricingInput): TransactionPricingValues {
  const nextQuantity = sanitizeEditableQuantity(quantity);
  if (nextQuantity === 0) {
    return { quantity: 0, fee: 0, ttc: 0 };
  }

  const tt = nextQuantity * unitPrice;
  const currentTtc = sanitizeNonNegative(ttc);

  if (action === "buy") {
    const currentFee = Math.min(100, sanitizeNonNegative(fee));
    const minimumTtc = tt + currentFee;
    const nextTtc =
      currentTtc >= minimumTtc
        ? currentTtc
        : getMinimumBuyTtc(tt, currentFee, currentTtc);

    return {
      quantity: nextQuantity,
      fee: currentFee,
      ttc: nextTtc,
    };
  }

  const { fee: nextFee, ttc: suggestedTtc } = getMinimumTtcWithFee(
    tt,
    currentTtc,
  );
  const nextTtc = tt + nextFee > currentTtc ? suggestedTtc : currentTtc;

  return {
    quantity: nextQuantity,
    fee: nextFee,
    ttc: nextTtc,
  };
}

export function computeFeePricing({
  action,
  fee,
  quantity,
  ttc,
  unitPrice,
}: TransactionPricingInput): TransactionPricingValues {
  const nextQuantity = sanitizeEditableQuantity(quantity);
  if (nextQuantity === 0) {
    return { quantity: 0, fee: 0, ttc: 0 };
  }

  const tt = nextQuantity * unitPrice;
  const currentTtc = sanitizeNonNegative(ttc);

  if (action === "buy") {
    const nextFee = Math.min(100, sanitizeNonNegative(fee));
    const minimumTtc = tt + nextFee;
    const nextTtc =
      currentTtc >= minimumTtc
        ? currentTtc
        : getMinimumBuyTtc(tt, nextFee, currentTtc);

    return {
      quantity: nextQuantity,
      fee: nextFee,
      ttc: nextTtc,
    };
  }

  const { fee: nextFee, ttc: suggestedTtc } = getMinimumTtcWithFee(
    tt,
    currentTtc,
  );
  const nextTtc = tt + nextFee > currentTtc ? suggestedTtc : currentTtc;

  return {
    quantity: nextQuantity,
    fee: nextFee,
    ttc: nextTtc,
  };
}

export function computeTtcPricing({
  action,
  fee,
  quantity,
  ttc,
  unitPrice,
}: TransactionPricingInput): TransactionPricingValues {
  const nextQuantity = sanitizeEditableQuantity(quantity);
  if (nextQuantity === 0) {
    return { quantity: 0, fee: 0, ttc: 0 };
  }

  const tt = nextQuantity * unitPrice;
  const currentTtc = sanitizeNonNegative(ttc);

  if (action === "buy") {
    const currentFee = Math.min(100, sanitizeNonNegative(fee));

    return {
      quantity: nextQuantity,
      fee: currentFee,
      ttc: currentTtc,
    };
  }

  const { fee: nextFee } = getMinimumTtcWithFee(tt, currentTtc);

  return {
    quantity: nextQuantity,
    fee: nextFee,
    ttc: currentTtc,
  };
}
