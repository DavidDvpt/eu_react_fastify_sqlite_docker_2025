import type { SessionStatus } from '../../../prisma/generated/client.js';

export type RunningTransactionLineRow = {
  id: string;
  itemId: string;
  quantity: number;
  tt: number;
  fee: number;
  ttc: number;
  status: 'RUNNING';
  createdAt: string;
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
