import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateRunningSellLineStatus } from "@/modules/transactions/transaction.api";

type UpdateRunningSellGroupStatusInput = {
  sessionLineIds: string[];
  status: "SOLDED" | "RETURNED";
};

function useUpdateRunningSellStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateRunningSellGroupStatusInput) => {
      await Promise.all(
        input.sessionLineIds.map((sessionLineId) =>
          updateRunningSellLineStatus({ sessionLineId, status: input.status }),
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
