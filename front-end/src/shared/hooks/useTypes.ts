import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useCategories from "./useCategories";
import type { Types } from "../types";
import { getTypes } from "@/modules/manage";

type UseTypesParams = {
  enabled?: boolean;
  categoryId?: string;
  prefillSelect?: boolean;
};

function useTypes({
  enabled = true,
  categoryId,
  prefillSelect = true,
}: UseTypesParams) {
  const { categories } = useCategories();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["types"],
    queryFn: getTypes,
    enabled,
    staleTime: Infinity,
  });

  const enrichTypes = useMemo(() => {
    const enrich = query.data?.map((m) => {
      const c = categories.find((f) => f.id === m.categoryId);
      return { ...m, categoryName: c?.name ?? "Unknown" };
    });

    return (enrich ?? []) as Types;
  }, [categories, query.data]);

  const filteredTypes = useMemo(() => {
    if (categoryId) {
      return enrichTypes?.filter((f) => f.categoryId === categoryId) as Types;
    }

    return (prefillSelect ? enrichTypes : []) as Types;
  }, [enrichTypes, categoryId, prefillSelect]);

  const invalidateTypes = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["types"] }),
    [queryClient],
  );

  return {
    types: enrichTypes,
    filteredTypes: filteredTypes,
    ...query,
    invalidateTypes,
  };
}

export default useTypes;
