import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import type {
  BuyTransactionBody,
  RunningSellLine,
  SellTransactionBody,
  TransactionExecutionResult,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL;
const TRANSACTIONS_ROUTE = `${API_URL}/inventory/transactions`;
const RUNNING_SELL_LINES_ROUTE = `${API_URL}/sessions/sell/
running-lines`;

async function buyTransaction(
  body: BuyTransactionBody,
): Promise<TransactionExecutionResult> {
  return axiosCrud(axiosInstance()).post<
    TransactionExecutionResult,
    BuyTransactionBody
  >(TRANSACTIONS_ROUTE, body);
}

async function sellTransaction(
  body: SellTransactionBody,
): Promise<TransactionExecutionResult> {
  return axiosCrud(axiosInstance()).post<
    TransactionExecutionResult,
    SellTransactionBody
  >(TRANSACTIONS_ROUTE, body);
}

async function getRunningSellLines(): Promise<RunningSellLine[]> {
  return axiosCrud(axiosInstance()).get<RunningSellLine[]>(
    RUNNING_SELL_LINES_ROUTE,
  );
}

export {
  buyTransaction,
  sellTransaction,
  getRunningSellLines,
  RUNNING_SELL_LINES_ROUTE,
  TRANSACTIONS_ROUTE,
};
