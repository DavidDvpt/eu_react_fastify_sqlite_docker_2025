import type { TransactionBody, TransactionStatusPatch, TransactionStatusPatchStatus } from "@/api/generated/model";
import { ApiService } from "@/shared/services/apiCrudService";
import {
  transactionQuerySchema,
  type PrismaMutationResponse,
  type TransactionDto,
  type TransactionDtos,
  type TransactionQuery,
} from "@zod-schemas";

export default class TransactionsApi extends ApiService<
  TransactionQuery,
  TransactionDto[],
  TransactionBody,
  PrismaMutationResponse,
  Partial<TransactionBody>,
  { transactionId: string }
> {
  protected route = "/transactions";
  protected querySchema = transactionQuerySchema;

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
    return this.axios.patch<PrismaMutationResponse, TransactionStatusPatch>(
      `${this.route}/${id}/status`,
      { status },
    );
  }
}