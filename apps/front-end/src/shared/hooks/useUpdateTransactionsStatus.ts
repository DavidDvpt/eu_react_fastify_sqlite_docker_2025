import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTransactionStatus } from "@/lib/services/transaction.api";
import type { UpdateTransactionInput } from "../types";

function useUpdateTransactionsStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateTransactionInput) => {
      await updateTransactionStatus({
        id,
        status,
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["running-sell-lines"] }),
        queryClient.invalidateQueries({ queryKey: ["items-stock"] }),
        queryClient.invalidateQueries({ queryKey: ["stock", "details"] }),
        queryClient.invalidateQueries({ queryKey: ["pedCard"] }),
      ]);
    },
  });
}

export default useUpdateTransactionsStatus;
