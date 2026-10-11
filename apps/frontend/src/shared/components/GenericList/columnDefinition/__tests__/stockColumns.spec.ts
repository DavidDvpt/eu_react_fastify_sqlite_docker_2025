import { describe, expect, it, vi } from "vitest";

import type { StockRow } from "@/shared/helpers/stock";
import { stockColumns } from "../stockColumns";

function row(overrides: Partial<StockRow> = {}): StockRow {
  return {
    id: "sword",
    name: "Sword",
    value: 100,
    stock: 1,
    lots: [],
    lotId: null,
    tierLevel: null,
    type: null,
    ...overrides,
  } as StockRow;
}

describe("stockColumns name", () => {
  const nameColumn = stockColumns().find((column) => column.key === "name");

  it("suffixes the tier of a tierable non-stackable instance", () => {
    expect(
      nameColumn?.render?.(
        row({
          lotId: "lot-1",
          tierLevel: 3,
          type: { hasTierOption: true, isStackable: false } as never,
        }),
      ),
    ).toBe("Sword T3");
  });

  it("keeps the raw name for stackable items", () => {
    expect(
      nameColumn?.render?.(
        row({ type: { hasTierOption: true, isStackable: true } as never }),
      ),
    ).toBe("Sword");
  });

  it("keeps the raw name for non-tierable items", () => {
    expect(
      nameColumn?.render?.(
        row({
          lotId: "lot-1",
          tierLevel: null,
          type: { hasTierOption: false, isStackable: false } as never,
        }),
      ),
    ).toBe("Sword");
  });

  it("keeps the raw name when the tier is missing", () => {
    expect(
      nameColumn?.render?.(
        row({
          lotId: "lot-1",
          tierLevel: null,
          type: { hasTierOption: true, isStackable: false } as never,
        }),
      ),
    ).toBe("Sword");
  });
});

describe("stockColumns refiner action", () => {
  it("adds a button column when onRefine is provided", () => {
    const columns = stockColumns(false, { onRefine: vi.fn() });

    const refinerColumn = columns.find((column) => column.key === "refiner");
    expect(refinerColumn).toBeDefined();
    expect(refinerColumn?.kind).toBe("button");
  });

  it("does not add a refiner column without onRefine", () => {
    expect(
      stockColumns(false).find((column) => column.key === "refiner"),
    ).toBeUndefined();
  });

  it("renders the action only for stackable items", () => {
    const columns = stockColumns(false, { onRefine: vi.fn() });
    const refinerColumn = columns.find((column) => column.key === "refiner");

    const stackable = row({ type: { isStackable: true } as never });
    const instance = row({ type: { isStackable: false } as never });

    expect(refinerColumn?.render?.(stackable)).not.toBeNull();
    expect(refinerColumn?.render?.(instance)).toBeNull();
  });
});
