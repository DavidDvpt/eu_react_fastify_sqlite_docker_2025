type BuyLineInput = {
  itemId: string;
  quantity: number;
  tt: number;
  ttc: number;
  fee?: number;
};

type SellLineInput = {
  itemId: string;
  quantity: number;
  inventoryLotId?: string;
  tt: number;
  ttc: number;
  fee: number;
};

type TransactionRejectedItem = {
  itemId: string;
  requestedQuantity: number;
  availableQuantity: number;
  reason: string;
};

type TransactionProcessedItem = {
  itemId: string;
  quantity: number;
};

type TransactionExecutionResult = {
  sessionId: string | null;
  processed: TransactionProcessedItem[];
  rejected: TransactionRejectedItem[];
};

export type {
  BuyLineInput,
  SellLineInput,
  TransactionRejectedItem,
  TransactionProcessedItem,
  TransactionExecutionResult,
};
