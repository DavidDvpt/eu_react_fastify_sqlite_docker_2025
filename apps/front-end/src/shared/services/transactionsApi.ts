import type {
  PrismaMutationResponse,
  TransactionBodyDto,
  TransactionQuerySchema,
  TransactionStatusPatchDto,
} from "@eu/types";
import {
  transactionQuerySchema,
  type TransactionDto,
  type TransactionDtos,
} from "@eu/zod-schemas";

import { ApiService } from "@/shared/services/apiCrudService";

export default class TransactionsApi extends ApiService<
  TransactionQuerySchema,
  TransactionDto[],
  TransactionBodyDto,
  PrismaMutationResponse,
  Partial<TransactionBodyDto>,
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
    status: TransactionStatusPatchDto;
  }) {
    return this.axios.patch<
      PrismaMutationResponse,
      { status: TransactionStatusPatchDto }
    >(`${this.route}/${id}/status`, { status });
  }
}
