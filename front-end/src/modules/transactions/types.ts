import type { StockRow } from "@/shared/types";

export type TransactionSellFormFieldsProps = Pick<
  TransactionPanelProps,
  "item"
>;
export type TransactionBuyFormValues = {
  quantity: number;
  fee: number;
  buyPrice: number;
  autoCalculation: boolean;
};

export type TransactionSellFormValues = {
  autoCalculation: boolean;
  quantity: number;
  fee: number;
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

type BuyTransactionLineInput = {
  itemId: string;
  quantity: number;
  tt: number;
  ttc: number;
  fee?: number;
};

export type BuyTransactionBody = {
  type: "buy";
  lines: BuyTransactionLineInput[];
};

export type SellTransactionLineInput = {
  itemId: string;
  quantity: number;
  inventoryLotId?: string;
  tt: number;
  ttc: number;
  fee: number;
};

export type SellTransactionBody = {
  type: "sell";
  lines: SellTransactionLineInput[];
};

export type TransactionProcessedItem = {
  itemId: string;
  quantity: number;
};

export type TransactionRejectedItem = {
  itemId: string;
  requestedQuantity: number;
  availableQuantity: number;
  reason: string;
};

export type TransactionExecutionResult = {
  transactionId: string | null;
  processed: TransactionProcessedItem[];
  rejected: TransactionRejectedItem[];
  message?: string;
};

export type RunningTransactionLine = {
  transactionLotId: string;
  transactionId: string;
  itemId: string;
  itemName: string;
  inventoryLotId: string | null;
  quantity: number;
  tt: number;
  ttc: number;
  lineStatus: "OPENNED" | "CLOSED" | "ARCHIVED";
  saleStatus: "RUNNING";
};

export type UpdateRunningTransactionLineStatusInput = {
  transactionLotId: string;
  status: "SOLDED" | "RETURNED";
};

export type UpdateRunningTransactionLineStatusResult = {
  transactionId: string;
  transactionLotId: string;
  saleStatus: "SOLDED" | "RETURNED";
  lineStatus: "CLOSED";
  transactionStatus: "OPENNED" | "CLOSED" | "ARCHIVED";
};
