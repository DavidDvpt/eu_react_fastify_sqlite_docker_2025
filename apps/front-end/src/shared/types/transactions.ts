import type { CSSProperties } from "react";
import type { StockRow } from "@/shared/types";

import type { Item } from "@/shared/types";
import type { ItemInventory } from "@/pages/inventoryPage/inventory/stockTypes";
import type { UseFormReturn } from "react-hook-form";
import type {
  ItemDto,
  TransactionDto,
  TransactionStatusDto,
  TransactionStatusPatchDto,
} from "@eu/types";

export interface TransactionWithItem extends TransactionDto {
  item: ItemDto;
}

export type TransactionFormValues = {
  autoCalculation: boolean;
  quantity: number;
  fee: number;
  buyPrice: number;
};
export type TransactionPricingField = "quantity" | "fee" | "ttc";
export type TransactionAction = "buy" | "sell" | "resell" | "newSell";

export type TransactionPanelProps = {
  item: ItemInventory;
  onBack: () => void;
  modalParams: TransactionModalParams;
  defaultValues?: Partial<Pick<AutoPricingFormValues, TransactionPricingField>>;
};

export type TransactionFormFieldsProps = Pick<
  TransactionPanelProps,
  "item" | "modalParams"
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

export type TransactionPricingSnapshot = TransactionPricingValues & {
  autoCalculation: boolean;
};

export type AutoPricingFormValues = {
  action: TransactionAction;
  autoCalculation: boolean;
  quantity: number;
  fee: number;
  ttc: number;
};

export type TransactionModalParams = {
  action: TransactionAction;
  itemId: string;
  quantity: number;
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

export type RunningTransaction = {
  groupKey: string;
  id: string;
  quantity: number;
  tt: number;
  fee: number;
  ttc: number;
  status: TransactionStatusDto;
} & {
  item: Item | null;
};

export type CreateRunningTransactionsColumnsOptions = {
  isRowPending: (row: TransactionWithItem) => boolean;
  onStatusChange: (
    row: TransactionWithItem,
    status: TransactionStatusPatchDto,
  ) => void;
};

export type UpdateTransactionInput = {
  id: string;
  status: TransactionStatusPatchDto;
};

export type TransactionPricingValues = {
  quantity: number;
  fee: number;
  ttc: number;
};

export type TransactionPricingInput = TransactionPricingValues & {
  action: TransactionAction;
  unitPrice: number;
};

export type TransactionModalQueries = {
  action: TransactionAction;
  itemId: string;
  quantity: number;
  ttc: number;
  closePath: string;
};

export type UseTransactionQueriesResult = {
  queries: TransactionModalQueries | null;
  updateQueries: (nextQueries: TransactionModalQueries | null) => void;
};
