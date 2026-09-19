import type { IdResponse, TransactionBody, TransactionStatusPatch, TransactionStatusPatchStatus } from "@/api/generated/model";
import type { ListTransactionsApiV2TransactionsGetParams } from "@/api/generated/model";
import { ListTransactionsApiV2TransactionsGetParams as listTransactionsParamsSchema } from "@/api/generated/zod/model/listTransactionsApiV2TransactionsGetParams.zod";
import { ApiService } from "@/shared/services/apiCrudService";
import {
  type TransactionDto,
  type TransactionDtos,
} from "@zod-schemas";

export default class TransactionsApi extends ApiService<
  ListTransactionsApiV2TransactionsGetParams,
  TransactionDto[],
  TransactionBody,
  IdResponse,
  Partial<TransactionBody>,
  { transactionId: string }
> {
  protected route = "/transactions";
  protected querySchema = listTransactionsParamsSchema;

  async running() {
    return await this.axios.get<TransactionDtos>(`${this.route}/running`);
  }
  async updateStatus({
    id,
    status,
  }: {
    id: string;
    status: TransactionStatusPatchStatus;
  }) {
    return this.axios.patch<IdResponse, TransactionStatusPatch>(
      `${this.route}/${id}/status`,
      { status },
    );
  }
}
