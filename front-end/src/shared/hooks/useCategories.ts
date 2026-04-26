import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "@/pages/manage/services/categoriesApi";
import { SelectOptionHelper } from "../components/form/Select/select.utils";

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

  const categoriesForSelect =
    query.data?.map((category) =>
      SelectOptionHelper({
        id: category.id,
        label: category.name,
      }),
    ) ?? [];
  return {
    ...query,
    invalidateCategories,
    categoriesForSelect,
  };
}

export default useCategories;
