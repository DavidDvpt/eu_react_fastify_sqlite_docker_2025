import type {
  IdResponse,
  TransactionBody,
  TransactionEntryResponse,
  TransactionStatusPatch,
  TransactionStatusPatchStatus,
} from "@/api/generated/model";
import type { ListTransactionsApiV2TransactionsGetParams } from "@/api/generated/model";
import { ListTransactionsApiV2TransactionsGetParams as listTransactionsParamsSchema } from "@/api/generated/zod/model/listTransactionsApiV2TransactionsGetParams.zod";
import { ApiService } from "@/shared/services/apiCrudService";
import type { TransactionViewModels } from "@zod-schemas";

export default class TransactionsApi extends ApiService<
  ListTransactionsApiV2TransactionsGetParams,
  TransactionEntryResponse[],
  TransactionBody,
  IdResponse,
  Partial<TransactionBody>,
  void
> {
  protected route = "/transactions";
  protected querySchema = listTransactionsParamsSchema;

  async running() {
    return await this.axios.get<TransactionViewModels>(`${this.route}/running`);
  }
  async updateStatus({
    id,
    status,
  }: {
    id: string;
    status: TransactionStatusPatchStatus;
  }) {
    return this.axios.patch<void, TransactionStatusPatch>(
      `${this.route}/${id}/status`,
      { status },
    );
  }
}
