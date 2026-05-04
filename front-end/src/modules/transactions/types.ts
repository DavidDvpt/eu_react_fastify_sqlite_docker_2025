import type { StockRow } from "@/shared/types";

export type TransactionBuyFormValues = {
  quantity: number;
  fee: number;
  buyPrice: number;
};

export type TransactionSellFormValues = {
  quantity: number;
  ttc: number;
};

export type TransactionPanelProps = {
  item: TransactionFilterRow;
  onBack: () => void;
};

export type TransactionBuyFormFieldsProps = Pick<TransactionPanelProps, "item">;

export type TransactionFilterRow = StockRow & {
  itemTypeId: string | null;
  itemTypeName: string | null;
  categoryId: string | null;
  categoryName: string | null;
};

export type TransactionActionsProps = {
  onBuy: () => void;
  onSell: () => void;
  onBack: () => void;
  direction?: "row" | "column";
  className?: string;
  buttonClassName?: string;
  disableBuy?: boolean;
  disableSell?: boolean;
};

export type TransactionItemDetailsProps = {
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
