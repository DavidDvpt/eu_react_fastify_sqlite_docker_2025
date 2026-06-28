export type TransactionFormValues = {
  autoCalculation: boolean;
  quantity: number;
  fee: number;
  buyPrice: number;
};

import type { CSSProperties } from "react";
import type { StockRow } from "@/shared/types";
import type { UseFormReturn } from "node_modules/react-hook-form/dist/types/form";

export type TransactionAction = "buy" | "sell";

export type TransactionPanelProps = {
  item: TransactionFilterRow;
  onBack: () => void;
  action: TransactionAction;
};

export type TransactionFormFieldsProps = Pick<
  TransactionPanelProps,
  "item" | "action"
>;

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
  imageStyle?: CSSProperties;
  actionsClassName?: string;
  buttonClassName?: string;
};

export type TransactionBody = {
  type: TransactionAction;
  lines: TransactionLineInput[];
};

export type TransactionLineInput = {
  itemId: string;
  quantity: number;
  inventoryLotId?: string;
  tt: number;
  ttc: number;
  fee: number;
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

export type AutoPricingFormValues = {
  action: TransactionAction;
  autoCalculation: boolean;
  quantity: number;
  fee: number;
  ttc: number;
};

export type UseTransactionAutoPricingParams<
  TFormValues extends AutoPricingFormValues,
> = {
  form: UseFormReturn<TFormValues>;
  action: TransactionAction;
  unitPrice: number;
};

export type UseTransactionAutoPricingResult = {
  applyAutoCalculationIfNeeded: (checked: boolean) => void;
  feeValue: number;
  isFeeReadOnly: boolean;
  isAutoCalculationEnabled: boolean;
  quantityValue: number;
  totalValue: number;
};
