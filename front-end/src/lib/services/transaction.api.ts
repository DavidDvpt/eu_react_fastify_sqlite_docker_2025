import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import type {
  RunningTransactionLine,
  TransactionBody,
  TransactionExecutionResult,
  UpdateRunningTransactionLineStatusInput,
  UpdateRunningTransactionLineStatusResult,
} from "@/shared/types";
import API_ROUTES from "./apiRoutes";

async function transaction(
  body: TransactionBody,
): Promise<TransactionExecutionResult> {
  return axiosCrud(axiosInstance()).post<
    TransactionExecutionResult,
    TransactionBody
  >(API_ROUTES.transactionsRoutes, body);
}

async function getRunningTransactionLines(): Promise<RunningTransactionLine[]> {
  return axiosCrud(axiosInstance()).get<RunningTransactionLine[]>(
    API_ROUTES.runningTransactionLinesRoutes,
  );
}

async function updateRunningTransactionLineStatus(
  input: UpdateRunningTransactionLineStatusInput,
): Promise<UpdateRunningTransactionLineStatusResult> {
  return axiosCrud(axiosInstance()).patch<
    UpdateRunningTransactionLineStatusResult,
    { status: "SOLDED" | "RETURNED" }
  >(
    `${API_ROUTES.transactionLineStatusRoutes}/${input.transactionLotId}/status`,
    {
      status: input.status,
    },
  );
}

export {
  transaction,
  getRunningTransactionLines,
  updateRunningTransactionLineStatus,
};
