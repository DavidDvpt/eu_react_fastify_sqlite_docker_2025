import type { StockRow } from "@/modules/stock";

type TradeFilterRow = StockRow & {
  itemTypeId: string | null;
  itemTypeName: string | null;
  categoryId: string | null;
  categoryName: string | null;
};

export type { TradeFilterRow };
