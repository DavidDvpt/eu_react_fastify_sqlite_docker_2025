import { describe, expect, it } from "vitest";
import { formatItemNameWithTier, formatTierLevel } from "../tier";

describe("formatTierLevel", () => {
  it.each([
    [0, "T0"],
    [5, "T5"],
    [10, "T10"],
  ])("formats tier %s", (tier, expected) => {
    expect(formatTierLevel(tier)).toBe(expected);
  });

  it("does not display a null tier", () => {
    expect(formatTierLevel(null)).toBe("");
  });

  it("appends the tier to tierable item names", () => {
    expect(
      formatItemNameWithTier({
        name: "Sword",
        hasTierOption: true,
        isStackable: false,
        tierLevel: 5,
      }),
    ).toBe("Sword T5");
  });

  it("does not append tiers to stackable or non-tierable items", () => {
    expect(
      formatItemNameWithTier({
        name: "Ore",
        hasTierOption: true,
        isStackable: true,
        tierLevel: 5,
      }),
    ).toBe("Ore");
    expect(
      formatItemNameWithTier({
        name: "Tool",
        hasTierOption: false,
        tierLevel: 5,
      }),
    ).toBe("Tool");
  });
});
