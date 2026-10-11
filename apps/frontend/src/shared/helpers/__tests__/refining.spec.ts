import { describe, expect, it } from "vitest";

import type { RefinageRecipeResponse } from "@/api/generated/react-query/model";
import {
  REFINING_PROVENANCES,
  buildRefinageOriginPayload,
  computeRefinageMaxClickCount,
  getRecipePpcm,
  isRecipeRefinable,
} from "../refining";
import { NumberHelper } from "../NumberHelper.js";

function lines(...entries: Array<[origin: string, quantity: number]>): RefinageRecipeResponse[] {
  return entries.map(([origin, quantity]) => ({ result: "gold", origin, quantity }));
}

describe("NumberHelper gcd/lcm", () => {
  it("computes the gcd of two integers", () => {
    expect(NumberHelper.gcd(12, 18)).toBe(6);
    expect(NumberHelper.gcd(7, 5)).toBe(1);
  });

  it("computes the lcm of several integers", () => {
    expect(NumberHelper.lcm(3, 2)).toBe(6);
    expect(NumberHelper.lcm(6, 8)).toBe(24);
    expect(NumberHelper.lcm(4, 6, 8)).toBe(24);
  });

  it("returns 0 for an empty lcm call", () => {
    expect(NumberHelper.lcm()).toBe(0);
  });
});

describe("getRecipePpcm", () => {
  it("returns the ppcm of all ingredient quantities", () => {
    expect(getRecipePpcm(lines(["a", 3], ["b", 2]))).toBe(6);
  });

  it("returns 0 when the recipe has no ingredients", () => {
    expect(getRecipePpcm([])).toBe(0);
  });
});

describe("computeRefinageMaxClickCount", () => {
  it("caps the number of results at the largest ppcm multiple allowed by stock", () => {
    // Recette 3A + 2B : ppcm = 6. Stock 24A / 230B → min(8, 115) = 8 → max 6.
    const stock: Record<string, number> = { a: 24, b: 230 };
    expect(
      computeRefinageMaxClickCount(lines(["a", 3], ["b", 2]), stock),
    ).toBe(6);
  });

  it("returns the max by stock when it is exactly a ppcm multiple", () => {
    const stock: Record<string, number> = { a: 60, b: 12 };
    expect(computeRefinageMaxClickCount(lines(["a", 3], ["b", 2]), stock)).toBe(6);
  });

  it("returns 0 when the stock cannot fill a single valid batch", () => {
    const stock: Record<string, number> = { a: 4, b: 230 };
    expect(computeRefinageMaxClickCount(lines(["a", 3], ["b", 2]), stock)).toBe(0);
  });

  it("treats a missing ingredient as out of stock", () => {
    const stock: Record<string, number> = { a: 24 };
    expect(computeRefinageMaxClickCount(lines(["a", 3], ["b", 2]), stock)).toBe(0);
  });

  it("returns 0 for an empty recipe", () => {
    expect(computeRefinageMaxClickCount([], {})).toBe(0);
  });
});

describe("isRecipeRefinable", () => {
  it("is true when at least one valid batch is possible", () => {
    const stock: Record<string, number> = { a: 24, b: 230 };
    expect(isRecipeRefinable(lines(["a", 3], ["b", 2]), stock)).toBe(true);
  });

  it("is false when the stock is below one ppcm batch", () => {
    const stock: Record<string, number> = { a: 4, b: 230 };
    expect(isRecipeRefinable(lines(["a", 3], ["b", 2]), stock)).toBe(false);
  });
});

describe("buildRefinageOriginPayload", () => {
  it("forwards the base ingredient quantities", () => {
    expect(buildRefinageOriginPayload(lines(["a", 3], ["b", 2]))).toEqual([
      { origin: "a", quantity: 3 },
      { origin: "b", quantity: 2 },
    ]);
  });
});

describe("REFINING_PROVENANCES", () => {
  it("lists the trade, mining and crafting origins without REFINING", () => {
    expect([...REFINING_PROVENANCES]).toEqual([
      "TRADE",
      "MINING",
      "CRAFTING",
    ]);
  });
});