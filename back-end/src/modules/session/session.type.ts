import type { SessionStatus, TransactionStatus } from '../../../prisma/generated/client.js';

export type TransactionSellRow = {
  transactionId: string;
  name: string;
  quantity: number;
  totalPrice: number;
  linesTotal: number;
  saleStatus: TransactionStatus | null;
};

export type RunningTransactionLineRow = {
  transactionLotId: string;
  transactionId: string;
  itemId: string;
  itemName: string;
  inventoryLotId: string | null;
  quantity: number;
  tt: number;
  ttc: number;
  lineStatus: SessionStatus;
  saleStatus: 'RUNNING';
};

export type UpdateTransactionLineStatusInput = {
  transactionLotId: string;
  nextSaleStatus: 'SOLDED' | 'RETURNED';
};

export type UpdateTransactionLineStatusResult = {
  transactionId: string;
  transactionLotId: string;
  saleStatus: 'SOLDED' | 'RETURNED';
  lineStatus: 'CLOSED';
  transactionStatus: SessionStatus;
};
