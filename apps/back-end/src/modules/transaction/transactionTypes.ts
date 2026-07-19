import type { TransactionDto } from '@eu/types';

export type TransactionBodyBuy = Pick<
  TransactionDto,
  'itemId' | 'quantity' | 'tt' | 'fee' | 'ttc' | 'status'
>;

export type TransactionBodySell = TransactionBodyBuy & {
  inventoryLotId?: string;
};

export type TransactionBodyPatch = Omit<TransactionBodyBuy, 'itemId'>;

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
  transactionId: string | null;
  processed: TransactionProcessedItem[];
  rejected: TransactionRejectedItem[];
};

export type { TransactionRejectedItem, TransactionProcessedItem, TransactionExecutionResult };
