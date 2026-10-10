import type { UseFormReturn } from "react-hook-form";
import type { TransactionViewModel } from "@zod-schemas";
import type { TransactionPanelProps } from "@/shared/components/TransactionModal/TransactionPanelContent";

export type TransactionFormValues = {
  isAuction: boolean;
  quantity: number;
  fee: number;
  buyPrice: number;
};
export type TransactionPricingField = "quantity" | "fee" | "ttc" | "tt";
export type TransactionAction = "buy" | "sell" | "resell" | "newSell";

export type TransactionFormFieldsProps = Pick<
  TransactionPanelProps,
  "item" | "modalParams"
>;

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

export type TransactionPricingSnapshot = TransactionPricingValues & {
  isAuction: boolean;
};

export type AutoPricingFormValues = {
  action: TransactionAction;
  isAuction: boolean;
  quantity: number;
  tt?: number;
  fee: number;
  ttc: number;
  lotCount?: number;
  tierLevel?: number;
};

export type TransactionModalParams = {
  action: TransactionAction;
  itemId: string;
  quantity: number;
  ttc: number;
  /** Selling MY single instance: this lot is consumed (required by the API). */
  lotId?: string;
};

export type UseTransactionAutoPricingParams<
  TFormValues extends AutoPricingFormValues,
> = {
  form: UseFormReturn<TFormValues>;
  action: TransactionAction;
  unitPrice: number;
  isNonStackable?: boolean;
};

export type UseTransactionAutoPricingResult = {
  applyAuctionIfNeeded: (checked: boolean) => void;
  feeValue: number;
  isFeeReadOnly: boolean;
  isAuctionEnabled: boolean;
  quantityValue: number;
  totalValue: number;
};

export type TransactionPricingValues = {
  quantity: number;
  tt?: number;
  fee: number;
  ttc: number;
};

export type TransactionPricingInput = Omit<TransactionPricingValues, "tt"> & {
  tt?: number;
  action: TransactionAction;
  unitPrice: number;
  /**
   * Auction mode (default true) applies the Entropia auction fee rules
   * (integer TTC). Free mode returns user inputs untouched.
   */
  isAuction?: boolean;
};

export type TransactionModalQueries = {
  action: TransactionAction;
  itemId: string;
  quantity: number;
  ttc: number;
  lotId?: string;
  closePath: string;
};

export type UseTransactionQueriesResult = {
  queries: TransactionModalQueries | null;
  updateQueries: (nextQueries: TransactionModalQueries | null) => void;
};

export type OpenTransactionModal = {
  action: TransactionAction;
  row: TransactionViewModel;
};
