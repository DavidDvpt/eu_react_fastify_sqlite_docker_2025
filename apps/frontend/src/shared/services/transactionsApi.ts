import { ApiService } from "@/shared/services/apiCrudService";
import {
  transactionQuerySchema,
  type PrismaMutationResponse,
  type TransactionBodyDto,
  type TransactionDto,
  type TransactionDtos,
  type TransactionQuery,
  type TransactionStatusPatchDto,
} from "@eu/zod-schemas";

export default class TransactionsApi extends ApiService<
  TransactionQuery,
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
