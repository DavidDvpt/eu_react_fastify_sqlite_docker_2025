import type {
  PrismaMutationResponse,
  TransactionBodyDto,
  TransactionDto,
  TransactionQuerySchema,
  TransactionStatusPatchDto,
} from "@eu/types";
import { transactionQuerySchema } from "@eu/zod-schemas";

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
