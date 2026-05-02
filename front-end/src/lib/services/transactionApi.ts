import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";

type BuyTransactionLineInput = {
  itemId: string;
  quantity: number;
  tt: number;
  ttc: number;
  fee?: number;
};

type BuyTransactionBody = {
  type: "buy";
  lines: BuyTransactionLineInput[];
};

type SellTransactionLineInput = {
  itemId: string;
  quantity: number;
  inventoryLotId?: string;
  tt: number;
  ttc: number;
  fee: number;
};

type SellTransactionBody = {
  type: "sell";
  lines: SellTransactionLineInput[];
};

type TransactionProcessedItem = {
  itemId: string;
  quantity: number;
};

type TransactionRejectedItem = {
  itemId: string;
  requestedQuantity: number;
  availableQuantity: number;
  reason: string;
};

type TransactionExecutionResult = {
  sessionId: string | null;
  processed: TransactionProcessedItem[];
  rejected: TransactionRejectedItem[];
  message?: string;
};

const API_URL = import.meta.env.VITE_API_URL;
const TRANSACTIONS_ROUTE = `${API_URL}/inventory/transactions`;

async function buyTransaction(body: BuyTransactionBody): Promise<TransactionExecutionResult> {
  return axiosCrud(axiosInstance()).post<TransactionExecutionResult, BuyTransactionBody>(
    TRANSACTIONS_ROUTE,
    body,
  );
}

async function sellTransaction(body: SellTransactionBody): Promise<TransactionExecutionResult> {
  return axiosCrud(axiosInstance()).post<TransactionExecutionResult, SellTransactionBody>(
    TRANSACTIONS_ROUTE,
    body,
  );
}

export { buyTransaction, sellTransaction, TRANSACTIONS_ROUTE };
export type {
  BuyTransactionBody,
  BuyTransactionLineInput,
  SellTransactionBody,
  SellTransactionLineInput,
  TransactionExecutionResult,
  TransactionProcessedItem,
  TransactionRejectedItem,
};
