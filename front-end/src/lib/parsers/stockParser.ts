import type {
  Stock,
  StockApi,
  StockDetails,
  StockDetailsApi,
  StockRow,
  StockRowApi,
} from "@/shared/types";

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
    unitPrice: toNumber(row.unitPrice),
    quantity: toNumber(row.quantity),
    totalPrice: toNumber(row.totalPrice),
  };
}

function parseStock(rows: StockApi): Stock {
  return rows.map(parseStockRow);
}

function parseStockDetails(details: StockDetailsApi): StockDetails {
  return {
    ...parseStockRow(details),
    lotsIn: details.lotsIn.map((lot) => ({
      id: lot.id,
      lotType: lot.lotType,
      quantityRemaining: toNumber(lot.quantityRemaining),
      quantityInitial: toNumber(lot.quantityInitial),
      quantityExported: toNumber(lot.quantityExported),
      priceRemaining: toNumber(lot.priceRemaining),
      dateCreated: lot.dateCreated,
    })),
    lotsOut: details.lotsOut.map((line) => ({
      id: line.id,
      dateCreated: line.dateCreated,
      quantity: toNumber(line.quantity),
      tt: toNumber(line.tt),
      ttc: toNumber(line.ttc),
      saleStatus: line.saleStatus,
    })),
  };
}

export { parseStock, parseStockDetails, parseStockRow };
