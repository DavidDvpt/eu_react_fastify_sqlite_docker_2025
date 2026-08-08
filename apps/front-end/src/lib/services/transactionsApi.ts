import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import type {
  TransactionBodyDto,
  TransactionDto,
  TransactionFormBody,
  TransactionStatusPatchDto,
} from "@eu/types";
import { transactionQuerySchema } from "@eu/zod-schemas";

export default class TransactionsApi {
  private axios;
  constructor() {
    this.axios = axiosCrud(axiosInstance());
  }

  async get(props: Partial<TransactionFormBody>) {
    const params = transactionQuerySchema.parse(props);
    return this.axios.get<TransactionDto[]>("/transactions", {
      params,
    });
  }
  async create(body: TransactionFormBody) {
    return this.axios.post<{ id: string }, TransactionFormBody>(
      "/transactions",
      body,
    );
  }
  async patch({
    id,
    body,
  }: {
    id: string;
    body: Partial<TransactionFormBody>;
  }) {
    return axiosCrud(axiosInstance()).patch<
      { transactionId: string },
      Partial<TransactionBodyDto>
    >(`/transactions/${id}`, body);
  }
  async patchStatus({
    id,
    status,
  }: {
    id: string;
    status: TransactionStatusPatchDto;
  }) {
    return axiosCrud(axiosInstance()).patch<void, TransactionStatusPatchDto>(
      `/transactions/${id}/status`,
      status,
    );
  }
}
