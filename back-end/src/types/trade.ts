import type { TransactionStatus } from '../../prisma/generated/client.js';

type PurchaseLineInput = {
  itemId: string;
  quantity: number;
  tt?: number;
  ttc: number;
};

type SellLineInput = {
  itemId: string;
  quantity: number;
  inventoryLotId?: string;
  tt?: number;
  ttc: number;
};

type TradeRejectedItem = {
  itemId: string;
  requestedQuantity: number;
  availableQuantity: number;
  reason: string;
};

type TradeProcessedItem = {
  itemId: string;
  quantity: number;
};

type TradeExecutionResult = {
  sessionId: string | null;
  processed: TradeProcessedItem[];
  rejected: TradeRejectedItem[];
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
  PurchaseLineInput,
  SellLineInput,
  TradeRejectedItem,
  TradeProcessedItem,
  TradeExecutionResult,
  SellSessionRow,
};
