import { describe, expect, it } from "vitest";

import { getMinimumTtcWithFee } from "@/shared/helpers/transactionHelpers";

import {
  computeFeePricing,
  computeQuantityPricing,
  computeTtcPricing,
} from "./transactionUtils";

describe("transactionUtils", () => {
  describe("computeQuantityPricing", () => {
    it("keeps buy quantity above stock and recomputes the ttc", () => {
      expect(
        computeQuantityPricing({
          action: "buy",
          quantity: 12,
          fee: 2,
          ttc: 200,
          unitPrice: 3,
        }),
      ).toEqual({
        quantity: 12,
        fee: 2,
        ttc: 200,
      });
    });

    it("returns zeroes when the quantity is empty", () => {
      expect(
        computeQuantityPricing({
          action: "buy",
          quantity: 0,
          fee: 2,
          ttc: 200,
          unitPrice: 3,
        }),
      ).toEqual({
        quantity: 0,
        fee: 0,
        ttc: 0,
      });
    });

    it("recomputes sell quantity with the minimum fee/ttc pair", () => {
      const result = computeQuantityPricing({
        action: "sell",
        quantity: 3,
        fee: 99,
        ttc: 100,
        unitPrice: 10,
      });

      expect(result).toEqual({
        quantity: 3,
        ...getMinimumTtcWithFee(30, 100),
      });
    });

    it("keeps sell ttc untouched when it already satisfies the threshold", () => {
      expect(
        computeQuantityPricing({
          action: "sell",
          quantity: 3,
          fee: 99,
          ttc: 200,
          unitPrice: 10,
        }),
      ).toEqual({
        quantity: 3,
        fee: getMinimumTtcWithFee(30, 200).fee,
        ttc: 200,
      });
    });
  });

  describe("computeFeePricing", () => {
    it("clamps buy fee to 100 and recomputes the ttc", () => {
      expect(
        computeFeePricing({
          action: "buy",
          quantity: 2,
          fee: 150,
          ttc: 15,
          unitPrice: 10,
        }),
      ).toEqual({
        quantity: 2,
        fee: 100,
        ttc: 120,
      });
    });

    it("ignores the raw fee on sell and recomputes from the current total", () => {
      const result = computeFeePricing({
        action: "sell",
        quantity: 2,
        fee: 8,
        ttc: 100,
        unitPrice: 50,
      });

      expect(result).toEqual({
        quantity: 2,
        ...getMinimumTtcWithFee(100, 100),
      });
    });
  });

  describe("computeTtcPricing", () => {
    it("keeps the buy fee and preserves the edited ttc value", () => {
      expect(
        computeTtcPricing({
          action: "buy",
          quantity: 2,
          fee: 7,
          ttc: 15,
          unitPrice: 10,
        }),
      ).toEqual({
        quantity: 2,
        fee: 7,
        ttc: 15,
      });
    });

    it("recomputes sell fee while preserving the edited ttc value", () => {
      const result = computeTtcPricing({
        action: "sell",
        quantity: 2,
        fee: 8,
        ttc: 105,
        unitPrice: 10,
      });

      expect(result).toEqual({
        quantity: 2,
        fee: getMinimumTtcWithFee(20, 105).fee,
        ttc: 105,
      });
    });
  });
});
