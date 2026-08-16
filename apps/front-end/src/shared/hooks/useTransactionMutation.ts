import { useMutation } from "@tanstack/react-query";

import TransactionsApi from "@/shared/services/transactionsApi";
import type {
  TransactionBodyDto,
  TransactionDto,
  TransactionStatusDto,
  TransactionStatusPatchDto,
  TransactionTypeDto,
} from "@eu/types";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import type {
  AutoPricingFormValues,
  ItemWithStock,
  TransactionAction,
} from "@/shared/types";

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
    onSuccess: async (data, { row }) => {
      await InvalidateQueryAndKeys.transactionStatusMutation({
        itemId: row.item?.id,
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
      } satisfies TransactionBodyDto);
    },
    onSuccess: async (data, { item }) => {
      await InvalidateQueryAndKeys.createTransactionMutation({
        itemId: item?.id,
      });
    },
  });

  return { statusMutation, createMutation };
}

export default useTransactionsMutation;
