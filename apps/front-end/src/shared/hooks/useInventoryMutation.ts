import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  TransactionFilterRow,
  TransactionFormValues,
  TransactionAction,
} from "../types";
import TransactionsApi from "@/shared/services/transactionsApi";

interface UseInventoryMutation {
  type: TransactionAction;
  item: TransactionFilterRow;
}

export function useInventoryMutation({ type, item }: UseInventoryMutation) {
  const queryClient = useQueryClient();
  const ts = new TransactionsApi();
  const mutation = useMutation({
    mutationFn: async (values: TransactionFormValues) => {
      return ts.create({
        transactionType: type === "sell" ? "SELL" : "BUY",
        itemId: item.itemId,
        quantity: values.quantity,
        tt: values.quantity * item.unitPrice,
        fee: values.fee,
        ttc: values.buyPrice,
        status: type === "sell" ? "RUNNING" : "SOLDED",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items-stock"] });
      queryClient.invalidateQueries({
        queryKey: ["stock", "details"],
      });
    },
  });

  return mutation;
}

export default useInventoryMutation;
