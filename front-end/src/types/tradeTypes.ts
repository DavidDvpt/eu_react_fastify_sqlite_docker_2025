import type { StockRow } from "./stockTypes";

type TradeFilterRow = StockRow & {
  itemTypeId: string | null;
  itemTypeName: string | null;
  categoryId: string | null;
  categoryName: string | null;
};

export type { TradeFilterRow };
