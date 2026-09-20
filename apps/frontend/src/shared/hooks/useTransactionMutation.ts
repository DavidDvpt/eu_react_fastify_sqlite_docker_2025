import { useMutation } from "@tanstack/react-query";
import type { TransactionBody } from "@/api/generated/model";
import {
  useCreateTransactionApiV2TransactionsPost,
  usePatchStatusApiV2TransactionsIdStatusPatch,
} from "@/api/generated/react-query/entropiaManagerAPI";
import type {
  TransactionStatusDto,
  TransactionStatusPatchDto,
  TransactionTypeDto,
} from "@zod-schemas";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import type {
  AutoPricingFormValues,
  ItemWithStock,
  TransactionAction,
} from "@/shared/types";
import type { TransactionViewModel } from "@zod-schemas";

function useTransactionsMutation() {
  const statusApi = usePatchStatusApiV2TransactionsIdStatusPatch();
  const createApi = useCreateTransactionApiV2TransactionsPost();

  const statusMutation = useMutation({
    mutationFn: async ({
      row,
      status,
    }: {
      row: TransactionViewModel;
      status: TransactionStatusPatchDto;
    }) => statusApi.mutateAsync({ id: row.id, data: { status } }),
    onSuccess: async (_data, { row, status }) => {
      await InvalidateQueryAndKeys.transactionMutation({
        itemId: row.item?.id,
        invalidatePedcard: status !== "RETURNED",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async ({
      values,
      item,
      action,
    }: {
      values: AutoPricingFormValues & { status: TransactionStatusDto };
      item: ItemWithStock;
      action: TransactionAction;
    }) => {
      return createApi.mutateAsync({ data: {
        transactionType: (action === "sell"
          ? "SELL"
          : "BUY") as TransactionTypeDto,
        itemId: item.id,
        quantity: values.quantity,
        tt: values.quantity * item.value,
        fee: values.fee,
        ttc: values.ttc,
        status: values.status,
      } satisfies TransactionBody });
    },
    onSuccess: async (_data, { item }) => {
      await InvalidateQueryAndKeys.transactionMutation({
        itemId: item?.id,
      });
    },
  });

  return { statusMutation, createMutation };
}

export default useTransactionsMutation;
