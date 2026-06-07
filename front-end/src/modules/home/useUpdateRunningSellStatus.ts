import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateRunningTransactionLineStatus } from "@/modules/transactions/transaction.api";

type UpdateRunningSellGroupStatusInput = {
  transactionLotIds: string[];
  status: "SOLDED" | "RETURNED";
};

function useUpdateRunningSellStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateRunningSellGroupStatusInput) => {
      await Promise.all(
        input.transactionLotIds.map((transactionLotId) =>
          updateRunningTransactionLineStatus({
            transactionLotId,
            status: input.status,
          }),
        ),
      );
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["running-sell-lines"] }),
        queryClient.invalidateQueries({ queryKey: ["items-stock"] }),
        queryClient.invalidateQueries({ queryKey: ["stock", "details"] }),
      ]);
    },
  });
}

export default useUpdateRunningSellStatus;
