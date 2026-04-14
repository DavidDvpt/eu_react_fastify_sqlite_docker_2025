import type { Stock, StockApi, StockRow, StockRowApi } from "./stockTypes";

function toNumber(value: number | string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return parsed;
}

function parseStockRow(row: StockRowApi): StockRow {
  return {
    itemId: row.itemId,
    imageUrlId: row.imageUrlId,
    name: row.name,
    quantity: toNumber(row.quantity),
    totalPrice: toNumber(row.totalPrice),
  };
}

function parseStock(rows: StockApi): Stock {
  return rows.map(parseStockRow);
}

export { parseStock, parseStockRow };
