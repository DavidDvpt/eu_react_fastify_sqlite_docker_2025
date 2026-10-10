import type { StockLineResponse } from "@/api/generated/react-query/model";
import type { ItemWithStock } from "@/shared/types";

/** A non-stackable physical instance with its editable identifiers. */
export interface StockLot {
  lotId: string;
  tierLevel: number | null;
}

export interface GroupedStock {
  quantity: number;
  lots: StockLot[];
}

export type GroupedStocks = Record<string, GroupedStock>;

/**
 * One rendered inventory row: either an aggregated stackable item or a
 * single non-stackable instance (one physical item = one row).
 */
export type StockRow = ItemWithStock & {
  lotId: string | null;
  tierLevel: number | null;
};

/**
 * Index stock lines by item id, summing quantities. Stackable lines
 * contribute their aggregated quantity; non-stackable lines contribute 1
 * each and keep their lot identifiers so the client can edit tiers via
 * `PATCH /inventory/lots/{lotId}/tier`.
 */
export function groupStockLines(
  lines: StockLineResponse[] | undefined,
): GroupedStocks {
  const grouped: GroupedStocks = {};
  if (!lines) return grouped;
  for (const line of lines) {
    const entry = grouped[line.itemId] ?? { quantity: 0, lots: [] as StockLot[] };
    entry.quantity += line.quantity;
    if (!line.isStackable && line.lotId != null) {
      entry.lots.push({ lotId: line.lotId, tierLevel: line.tierLevel ?? null });
    }
    grouped[line.itemId] = entry;
  }
  return grouped;
}

export function getStockForItem(grouped: GroupedStocks, itemId: string): number {
  return grouped[itemId]?.quantity ?? 0;
}

export function getLotsForItem(grouped: GroupedStocks, itemId: string): StockLot[] {
  return grouped[itemId]?.lots ?? [];
}

/**
 * Expand aggregated items into rendered rows. Stackable items (and items
 * without stock) produce a single row; each non-stackable instance produces
 * its own row carrying its `lotId`/`tierLevel` so the list shows one line
 * per physical item.
 */
export function buildStockRows(items: ItemWithStock[]): StockRow[] {
  const rows: StockRow[] = [];
  for (const item of items) {
    const lots = item.lots ?? [];
    if (lots.length === 0) {
      rows.push({ ...item, lotId: null, tierLevel: null });
      continue;
    }
    for (const lot of lots) {
      rows.push({
        ...item,
        stock: 1,
        lots: [lot],
        lotId: lot.lotId,
        tierLevel: lot.tierLevel,
      });
    }
  }
  return rows;
}
