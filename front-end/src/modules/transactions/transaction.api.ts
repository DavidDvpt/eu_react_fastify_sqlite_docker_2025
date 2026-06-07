import { env } from "@/config/env";
import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import type {
  BuyTransactionBody,
  RunningTransactionLine,
  SellTransactionBody,
  TransactionExecutionResult,
  UpdateRunningTransactionLineStatusInput,
  UpdateRunningTransactionLineStatusResult,
} from "./types";

const API_URL = env.VITE_API_URL;
const TRANSACTIONS_ROUTE = `${API_URL}/inventory/transactions`;
const RUNNING_TRANSACTION_LINES_ROUTE = `${API_URL}/transactions/sell/running-lines`;
const TRANSACTION_LINE_STATUS_ROUTE = `${API_URL}/transactions/sell/lines`;

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

async function getRunningTransactionLines(): Promise<RunningTransactionLine[]> {
  return axiosCrud(axiosInstance()).get<RunningTransactionLine[]>(
    RUNNING_TRANSACTION_LINES_ROUTE,
  );
}

async function updateRunningTransactionLineStatus(
  input: UpdateRunningTransactionLineStatusInput,
): Promise<UpdateRunningTransactionLineStatusResult> {
  return axiosCrud(axiosInstance()).patch<
    UpdateRunningTransactionLineStatusResult,
    { status: "SOLDED" | "RETURNED" }
  >(`${TRANSACTION_LINE_STATUS_ROUTE}/${input.transactionLotId}/status`, {
    status: input.status,
  });
}

export {
  buyTransaction,
  sellTransaction,
  getRunningTransactionLines,
  updateRunningTransactionLineStatus,
  RUNNING_TRANSACTION_LINES_ROUTE,
  TRANSACTION_LINE_STATUS_ROUTE,
  TRANSACTIONS_ROUTE,
};
