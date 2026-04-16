import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "@/pages/manage/services/categoriesApi";

type UseCategoriesParams = {
  enabled?: boolean;
};

function useCategories({ enabled = true }: UseCategoriesParams = {}) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled,
    staleTime: Infinity,
  });

  const invalidateCategories = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
    [queryClient],
  );

  return {
    ...query,
    invalidateCategories,
  };
}

export { useCategories };
