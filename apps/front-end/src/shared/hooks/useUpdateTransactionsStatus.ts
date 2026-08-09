import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateTransactionInput } from "../types";
import TransactionsApi from "@/shared/services/transactionsApi";

function useUpdateTransactionsStatus() {
  const queryClient = useQueryClient();
  const ts = new TransactionsApi();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateTransactionInput) => {
      await ts.patchStatus({
        id,
        status,
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["running-transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["items-stock"] }),
        queryClient.invalidateQueries({ queryKey: ["stock", "details"] }),
        queryClient.invalidateQueries({ queryKey: ["pedCard"] }),
      ]);
    },
  });
}

export default useUpdateTransactionsStatus;
