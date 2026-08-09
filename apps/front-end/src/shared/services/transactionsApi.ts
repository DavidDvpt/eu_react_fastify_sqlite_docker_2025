import type {
  PrismaMutationResponse,
  TransactionBodyDto,
  TransactionDto,
  TransactionFormBody,
  TransactionQuerySchema,
  TransactionStatusPatchDto,
} from "@eu/types";
import { transactionQuerySchema } from "@eu/zod-schemas";

import { ApiService } from "@/shared/services/apiCrudService";

export default class TransactionsApi extends ApiService<
  TransactionQuerySchema,
  TransactionDto[],
  TransactionFormBody,
  PrismaMutationResponse,
  Partial<TransactionBodyDto>,
  { transactionId: string }
> {
  protected route = "/transactions";
  protected querySchema = transactionQuerySchema;

  async patchStatus({
    id,
    status,
  }: {
    id: string;
    status: TransactionStatusPatchDto;
  }) {
    return this.axios.patch<void, TransactionStatusPatchDto>(
      `${this.route}/${id}/status`,
      status,
    );
  }
}
