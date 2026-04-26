import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getItems } from "@/pages/manage/services/itemsApi";

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
    [queryClient],
  );

  const itemsForSelect = (filter: { typeId?: string; pattern?: string }) => {
    const list = query.data
      ? query.data.filter((item) => {
          const matchesType = filter.typeId
            ? item.itemTypeId === filter.typeId
            : false;
          const matchesPattern = filter.pattern
            ? item.name.toLowerCase().includes(filter.pattern.toLowerCase())
            : false;
          return matchesType || matchesPattern;
        })
      : [];

    return list.map((item) => ({
      id: item.id,
      label: item.name,
    }));
  };

  return {
    ...query,
    invalidateItems,
    itemsForSelect,
  };
}

export default useItems;
