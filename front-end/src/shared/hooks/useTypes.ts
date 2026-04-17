import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTypes } from "@/pages/manage/services/typesApi";

type UseTypesParams = {
  enabled?: boolean;
};

function useTypes({ enabled = true }: UseTypesParams = {}) {
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

  return {
    ...query,
    invalidateTypes,
  };
}

export default useTypes;
