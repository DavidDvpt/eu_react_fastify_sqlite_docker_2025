import {
  getMinimumBuyTtc,
  getMinimumTtcWithFee,
  sanitizeNonNegative,
  sanitizeQuantity,
} from "@/modules/transactions/helpers";

import type { TransactionAction } from "@/shared/types/transactions";

export type TransactionPricingValues = {
  quantity: number;
  fee: number;
  ttc: number;
};

type TransactionPricingInput = TransactionPricingValues & {
  action: TransactionAction;
  unitPrice: number;
};

export function computeQuantityPricing({
  action,
  fee,
  quantity,
  ttc,
  unitPrice,
}: TransactionPricingInput): TransactionPricingValues {
  const nextQuantity = sanitizeQuantity(quantity);
  const tt = nextQuantity * unitPrice;

  if (action === "buy") {
    const currentFee = Math.min(100, sanitizeNonNegative(fee));
    const nextTtc = getMinimumBuyTtc(tt, currentFee, tt + currentFee);

    return {
      quantity: nextQuantity,
      fee: currentFee,
      ttc: nextTtc,
    };
  }

  const { fee: nextFee, ttc: nextTtc } = getMinimumTtcWithFee(tt, ttc);

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
  const nextQuantity = sanitizeQuantity(quantity);
  const tt = nextQuantity * unitPrice;

  if (action === "buy") {
    const nextFee = Math.min(100, sanitizeNonNegative(fee));
    const nextTtc = getMinimumBuyTtc(tt, nextFee, tt + nextFee);

    return {
      quantity: nextQuantity,
      fee: nextFee,
      ttc: nextTtc,
    };
  }

  const { fee: nextFee, ttc: nextTtc } = getMinimumTtcWithFee(tt, ttc);

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
  const nextQuantity = sanitizeQuantity(quantity);
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
