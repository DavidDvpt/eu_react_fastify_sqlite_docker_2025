import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTypes } from "@/pages/manage/services/typesApi";

type UseTypesParams = {
  enabled?: boolean;
  categoryId?: string;
};

function useTypes({ enabled = true, categoryId }: UseTypesParams = {}) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["types"],
    queryFn: getTypes,
    enabled,
    staleTime: Infinity,
  });

  const invalidateTypes = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["types"] }),
    [queryClient],
  );

  const filteredTypes = useMemo(
    () => query.data?.filter((t) => t.categoryId === categoryId) ?? [],
    [query.data, categoryId],
  );

  return {
    types: query.data ?? [],
    filteredTypes,
    ...query,
    invalidateTypes,
  };
}

export default useTypes;
