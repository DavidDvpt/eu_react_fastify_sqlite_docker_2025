import type { StockRow } from "./stockTypes";

type TradeFilterRow = StockRow & {
  itemTypeId: string | null;
  itemTypeName: string | null;
  categoryId: string | null;
  categoryName: string | null;
};

type TradeActionsProps = {
  onBuy: () => void;
  onSell: () => void;
  onBack: () => void;
  direction?: "row" | "column";
  className?: string;
  buttonClassName?: string;
  disableBuy?: boolean;
  disableSell?: boolean;
};
export type { TradeFilterRow, TradeActionsProps };
