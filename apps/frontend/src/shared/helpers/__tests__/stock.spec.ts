import { describe, expect, it } from "vitest";
import {
  buildStockRows,
  getLotsForItem,
  getStockForItem,
  groupStockLines,
} from "../stock";

describe("groupStockLines", () => {
  it("aggregates stackable lines per item without lot details", () => {
    const grouped = groupStockLines([
      { itemId: "ore", quantity: 3, isStackable: true },
      { itemId: "ore", quantity: 7, isStackable: true },
    ]);

    expect(getStockForItem(grouped, "ore")).toBe(10);
    expect(getLotsForItem(grouped, "ore")).toEqual([]);
  });

  it("keeps one lot entry per non-stackable instance", () => {
    const grouped = groupStockLines([
      { itemId: "sword", quantity: 1, isStackable: false, lotId: "lot-1", tierLevel: 3 },
      { itemId: "sword", quantity: 1, isStackable: false, lotId: "lot-2", tierLevel: 5 },
    ]);

    expect(getStockForItem(grouped, "sword")).toBe(2);
    expect(getLotsForItem(grouped, "sword")).toEqual([
      { lotId: "lot-1", tierLevel: 3 },
      { lotId: "lot-2", tierLevel: 5 },
    ]);
  });

  it("mixes stackable aggregates and non-stackable instances", () => {
    const grouped = groupStockLines([
      { itemId: "ore", quantity: 10, isStackable: true, lotId: null, tierLevel: null },
      { itemId: "sword", quantity: 1, isStackable: false, lotId: "lot-1", tierLevel: 0 },
    ]);

    expect(getStockForItem(grouped, "ore")).toBe(10);
    expect(getLotsForItem(grouped, "ore")).toEqual([]);
    expect(getStockForItem(grouped, "sword")).toBe(1);
    expect(getLotsForItem(grouped, "sword")).toEqual([{ lotId: "lot-1", tierLevel: 0 }]);
  });

  it("normalizes missing tier levels to null", () => {
    const grouped = groupStockLines([
      { itemId: "clothes", quantity: 1, isStackable: false, lotId: "lot-1" },
    ]);

    expect(getLotsForItem(grouped, "clothes")).toEqual([{ lotId: "lot-1", tierLevel: null }]);
  });

  it("ignores stackable lines without lot identifiers for tier edition", () => {
    const grouped = groupStockLines([
      { itemId: "ore", quantity: 4, isStackable: true, lotId: null },
    ]);

    expect(getLotsForItem(grouped, "ore")).toEqual([]);
  });

  it("returns zero and no lots for unknown items", () => {
    const grouped = groupStockLines([
      { itemId: "ore", quantity: 4, isStackable: true },
    ]);

    expect(getStockForItem(grouped, "unknown")).toBe(0);
    expect(getLotsForItem(grouped, "unknown")).toEqual([]);
  });

  it("handles undefined and empty inputs", () => {
    expect(groupStockLines(undefined)).toEqual({});
    expect(groupStockLines([])).toEqual({});
    expect(getStockForItem(groupStockLines([]), "ore")).toBe(0);
  });
});

describe("buildStockRows", () => {
  it("keeps stackable items as a single aggregated row", () => {
    const rows = buildStockRows([
      { id: "ore", name: "Ore", value: 2, stock: 10, lots: [] } as never,
    ]);

    expect(rows).toEqual([
      { id: "ore", name: "Ore", value: 2, stock: 10, lots: [], lotId: null, tierLevel: null },
    ]);
  });

  it("expands non-stackable instances into one row per lot", () => {
    const rows = buildStockRows([
      {
        id: "sword",
        name: "Sword",
        value: 100,
        stock: 2,
        lots: [
          { lotId: "lot-1", tierLevel: 3 },
          { lotId: "lot-2", tierLevel: 5 },
        ],
      } as never,
    ]);

    expect(rows).toEqual([
      {
        id: "sword",
        name: "Sword",
        value: 100,
        stock: 1,
        lots: [{ lotId: "lot-1", tierLevel: 3 }],
        lotId: "lot-1",
        tierLevel: 3,
      },
      {
        id: "sword",
        name: "Sword",
        value: 100,
        stock: 1,
        lots: [{ lotId: "lot-2", tierLevel: 5 }],
        lotId: "lot-2",
        tierLevel: 5,
      },
    ]);
  });

  it("keeps empty-stock items as a single zero row", () => {
    const rows = buildStockRows([
      { id: "ore", name: "Ore", value: 2, stock: 0, lots: [] } as never,
    ]);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ id: "ore", stock: 0, lotId: null });
  });

  it("preserves grouping order across mixed items", () => {
    const rows = buildStockRows([
      { id: "ore", name: "Ore", value: 2, stock: 10, lots: [] } as never,
      {
        id: "sword",
        name: "Sword",
        value: 100,
        stock: 1,
        lots: [{ lotId: "lot-1", tierLevel: 0 }],
      } as never,
    ]);

    expect(rows.map((row) => row.lotId ?? row.id)).toEqual(["ore", "lot-1"]);
  });
});
