import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getItems } from "@/modules/manage/services/itemsApi";

type UseItemsParams = {
  enabled?: boolean;
};

function useItems({ enabled = true }: UseItemsParams = {}) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
    enabled,
    staleTime: Infinity,
  });

  const invalidateItems = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["items"] }),
    [queryClient]
  );

  return {
    ...query,
    invalidateItems,
  };
}

export { useItems };
