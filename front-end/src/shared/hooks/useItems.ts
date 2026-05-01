import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getItems } from "@/pages/manage/services/itemsApi";

type UseItemsParams = {
  enabled?: boolean;
  typeId?: string;
};

function useItems({ enabled = true, typeId }: UseItemsParams = {}) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
    enabled,
    staleTime: Infinity,
  });

  const invalidateItems = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["items"] }),
    [queryClient],
  );

  const filteredItems = useMemo(
    () => query.data?.filter((t) => t.typeId === typeId) ?? [],
    [query.data, typeId],
  );

  return {
    items: query.data ?? [],
    filteredItems,
    ...query,
    invalidateItems,
  };
}

export default useItems;
