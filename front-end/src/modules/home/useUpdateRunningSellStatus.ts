import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateRunningSellLineStatus } from "@/modules/transactions/transaction.api";

function useUpdateRunningSellStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRunningSellLineStatus,
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
