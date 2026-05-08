import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import type {
  BuyTransactionBody,
  RunningSellLine,
  SellTransactionBody,
  TransactionExecutionResult,
  UpdateRunningSellLineStatusInput,
  UpdateRunningSellLineStatusResult,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL;
const TRANSACTIONS_ROUTE = `${API_URL}/inventory/transactions`;
const RUNNING_SELL_LINES_ROUTE = `${API_URL}/sessions/sell/running-lines`;
const SELL_LINE_STATUS_ROUTE = `${API_URL}/sessions/sell/lines`;

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

async function updateRunningSellLineStatus(
  input: UpdateRunningSellLineStatusInput,
): Promise<UpdateRunningSellLineStatusResult> {
  return axiosCrud(axiosInstance()).patch<
    UpdateRunningSellLineStatusResult,
    { status: "SOLDED" | "RETURNED" }
  >(`${SELL_LINE_STATUS_ROUTE}/${input.sessionLineId}/status`, {
    status: input.status,
  });
}

export {
  buyTransaction,
  sellTransaction,
  getRunningSellLines,
  updateRunningSellLineStatus,
  RUNNING_SELL_LINES_ROUTE,
  SELL_LINE_STATUS_ROUTE,
  TRANSACTIONS_ROUTE,
};
