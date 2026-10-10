import { describe, expect, it } from "vitest";

import { StockLineResponse } from "@/api/generated/zod/model/stockLineResponse.zod";

/**
 * Guards the `npm run api:update` step: the generated client must expose
 * stock *lines* (itemId/quantity/isStackable + nullable lotId/tierLevel),
 * not the legacy `dict[itemId -> qty]`. If the OpenAPI fetch or the orval
 * regen is skipped, this spec fails.
 */
describe("stock lines API contract", () => {
  it("parses a non-stackable instance line with its lot identifiers", () => {
    expect(
      StockLineResponse.parse({
        itemId: "sword",
        quantity: 1,
        isStackable: false,
        lotId: "lot-1",
        tierLevel: 3,
      }),
    ).toEqual({
      itemId: "sword",
      quantity: 1,
      isStackable: false,
      lotId: "lot-1",
      tierLevel: 3,
    });
  });

  it("parses a stackable aggregate line without lot identifiers", () => {
    expect(
      StockLineResponse.parse({ itemId: "ore", quantity: 10, isStackable: true }),
    ).toMatchObject({ itemId: "ore", quantity: 10, isStackable: true });
  });

  it("accepts explicit null lot identifiers", () => {
    const parsed = StockLineResponse.parse({
      itemId: "ore",
      quantity: 10,
      isStackable: true,
      lotId: null,
      tierLevel: null,
    });

    expect(parsed.lotId).toBeNull();
    expect(parsed.tierLevel).toBeNull();
  });

  it("rejects lines without a quantity", () => {
    expect(() =>
      StockLineResponse.parse({ itemId: "ore", isStackable: true }),
    ).toThrow();
  });
});
