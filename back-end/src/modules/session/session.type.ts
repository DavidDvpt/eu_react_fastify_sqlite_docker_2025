import type { SessionStatus, TransactionStatus } from '../../../prisma/generated/client.js';

export type SellSessionRow = {
  sessionId: string;
  name: string;
  quantity: number;
  totalPrice: number;
  linesTotal: number;
  saleStatus: TransactionStatus | null;
};

export type RunningSellLineRow = {
  sessionLineId: string;
  sessionId: string;
  itemId: string;
  itemName: string;
  inventoryLotId: string | null;
  quantity: number;
  tt: number;
  ttc: number;
  lineStatus: SessionStatus;
  saleStatus: 'RUNNING';
};

export type UpdateSellLineStatusInput = {
  sessionLineId: string;
  nextSaleStatus: 'SOLDED' | 'RETURNED';
};

export type UpdateSellLineStatusResult = {
  sessionId: string;
  sessionLineId: string;
  saleStatus: 'SOLDED' | 'RETURNED';
  lineStatus: 'CLOSED';
  sessionStatus: SessionStatus;
};
