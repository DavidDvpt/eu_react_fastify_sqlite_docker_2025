import type { StockRow } from "./stockTypes";

type TransactionFilterRow = StockRow & {
  itemTypeId: string | null;
  itemTypeName: string | null;
  categoryId: string | null;
  categoryName: string | null;
};

type TransactionActionsProps = {
  onBuy: () => void;
  onSell: () => void;
  onBack: () => void;
  direction?: "row" | "column";
  className?: string;
  buttonClassName?: string;
  disableBuy?: boolean;
  disableSell?: boolean;
};

type TransactionItemDetailsProps = {
  itemName: string;
  imageUrlId: string;
  unitPrice: number;
  quantity: number;
  onBuy: () => void;
  onSell: () => void;
  onBack: () => void;
  disableBuy?: boolean;
  disableSell?: boolean;
  actionsDirection?: "row" | "column";
  actionsPlacement?: "bottom" | "right";
  className?: string;
  actionsClassName?: string;
  buttonClassName?: string;
};

type TransactionBuyFormValues = {
  quantity: number;
  fee: number;
  buyPrice: number;
};

type TransactionSellFormValues = {
  quantity: number;
  ttc: number;
};

export type {
  TransactionFilterRow,
  TransactionActionsProps,
  TransactionItemDetailsProps,
  TransactionBuyFormValues,
  TransactionSellFormValues,
};
