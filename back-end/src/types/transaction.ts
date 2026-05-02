import type { TransactionStatus } from '../../prisma/generated/client.js';

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

type SellSessionRow = {
  sessionId: string;
  name: string;
  quantity: number;
  totalPrice: number;
  linesTotal: number;
  saleStatus: TransactionStatus | null;
};

export type {
  BuyLineInput,
  SellLineInput,
  TransactionRejectedItem,
  TransactionProcessedItem,
  TransactionExecutionResult,
  SellSessionRow,
};
