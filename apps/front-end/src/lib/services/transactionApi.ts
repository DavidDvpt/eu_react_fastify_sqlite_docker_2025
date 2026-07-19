import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";

import API_ROUTES from "./apiRoutes";
import type { RunningTransactionDtos, TransactionBodyDto } from "@eu/types";

export async function transaction(body: TransactionBodyDto) {
  return axiosCrud(axiosInstance()).post<
    { transactionId: string },
    TransactionBodyDto
  >(API_ROUTES.transactionsRoutes, body);
}

export async function getRunningTransactions() {
  return axiosCrud(axiosInstance()).get<RunningTransactionDtos>(
    API_ROUTES.runningTransactionRoutes,
  );
}

export async function patchTransaction(body: Partial<TransactionBodyDto>) {
  return axiosCrud(axiosInstance()).patch<
    { transactionId: string },
    Partial<TransactionBodyDto>
  >(`${API_ROUTES.transactionsRoutes}/${body.id}`, body);
}
