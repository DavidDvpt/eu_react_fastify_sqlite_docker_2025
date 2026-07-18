import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import type {
  RunningTransactionLine,
  TransactionBody,
  TransactionExecutionResult,
  TransactionStatus,
  UpdateTransactionInput,
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

async function updateTransactionStatus(
  input: UpdateTransactionInput,
): Promise<UpdateRunningTransactionLineStatusResult> {
  return axiosCrud(axiosInstance()).patch<
    UpdateRunningTransactionLineStatusResult,
    { status: TransactionStatus }
  >(
    `${API_ROUTES.transactionLineStatusRoutes}/${input.transactionLotId}/status`,
    {
      status: input.status,
    },
  );
}

export { transaction, getRunningTransactionLines, updateTransactionStatus };
