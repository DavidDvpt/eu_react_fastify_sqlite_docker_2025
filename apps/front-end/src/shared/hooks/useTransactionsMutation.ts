import { useMutation, useQueryClient } from "@tanstack/react-query";

import TransactionsApi from "@/shared/services/transactionsApi";
import type { TransactionDto, TransactionStatusPatchDto } from "@eu/types";
import type { OpenTransactionModal } from "@/shared/types";

interface UseTransactionsMutationProps {
  onStatusMutationSuccess: ({ action, row }: OpenTransactionModal) => void;
}
function useTransactionsMutation({
  onStatusMutationSuccess,
}: UseTransactionsMutationProps) {
  const queryClient = useQueryClient();
  const ts = new TransactionsApi();

  return useMutation({
    mutationFn: async ({
      row,
      status,
    }: {
      row: TransactionDto;
      status: TransactionStatusPatchDto;
    }) => ts.updateStatus({ id: row.id, status }),
    onSuccess: async (data, Variables) => {
      const { status, row } = Variables;
      const action = status === "SOLDED" ? "resell" : "sell";
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["running-transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["items-stock"] }),
        queryClient.invalidateQueries({ queryKey: ["stock", "details"] }),
        queryClient.invalidateQueries({ queryKey: ["pedcard"] }),
      ]);

      onStatusMutationSuccess({ action, row });
    },
  });
}

export default useTransactionsMutation;
