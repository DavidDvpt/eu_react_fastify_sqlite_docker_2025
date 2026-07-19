import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  TransactionFilterRow,
  TransactionFormValues,
  TransactionAction,
} from "../types";
import { transaction } from "@/lib/services/transactionApi";

interface UseInventoryMutation {
  type: TransactionAction;
  item: TransactionFilterRow;
}

export function useInventoryMutation({ type, item }: UseInventoryMutation) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: TransactionFormValues) => {
      return transaction({
        type,
        lines: [
          {
            itemId: item.itemId,
            quantity: values.quantity,
            tt: values.quantity * item.unitPrice,
            fee: values.fee,
            ttc: values.buyPrice,
          },
        ],
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
