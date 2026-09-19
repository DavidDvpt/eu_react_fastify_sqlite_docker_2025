import { useMutation } from "@tanstack/react-query";
import type { TransactionBody } from "@/api/generated/model";

import TransactionsApi from "@/shared/services/transactionsApi";
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
import type { TransactionDto } from "@zod-schemas";

function useTransactionsMutation() {
  const ts = new TransactionsApi();

  const statusMutation = useMutation({
    mutationFn: async ({
      row,
      status,
    }: {
      row: TransactionDto;
      status: TransactionStatusPatchDto;
    }) => ts.updateStatus({ id: row.id, status }),
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
      const ts = new TransactionsApi();
      return ts.create({
        transactionType: (action === "sell"
          ? "SELL"
          : "BUY") as TransactionTypeDto,
        itemId: item.id,
        quantity: values.quantity,
        tt: values.quantity * item.value,
        fee: values.fee,
        ttc: values.ttc,
        status: values.status,
      } satisfies TransactionBody);
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
