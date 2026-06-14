import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useCategories from "./useCategories";
import useTypes from "./useTypes";
import type { Items } from "../types";
import { getItems } from "@/lib/services";

type UseItemsParams = {
  enabled?: boolean;
  typeId?: string;
  categoryId?: string;
  prefillSelect?: boolean;
};

function useItems({
  enabled = true,
  typeId,
  categoryId,
  prefillSelect = true,
}: UseItemsParams) {
  const { categories } = useCategories();
  const { types } = useTypes({});

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

  const enrichItems = useMemo(() => {
    const enrich = query.data?.map((m) => {
      const t = types?.find((ft) => m.typeId === ft.id);
      const c = categories?.find((fc) => t?.categoryId === fc.id);

      return {
        ...m,
        typeName: t?.name,
        categoryId: c?.id,
        categoryName: c?.name,
      };
    });

    return (enrich ?? []) as Items;
  }, [query.data, types, categories]);

  const filteredItems = useMemo(() => {
    if (typeId) {
      return enrichItems?.filter((f) => f.typeId === typeId);
    }
    if (categoryId) {
      return enrichItems?.filter((f) => f.categoryId === categoryId);
    }

    return (prefillSelect ? enrichItems : []) as Items;
  }, [enrichItems, categoryId, typeId, prefillSelect]);

  return {
    items: enrichItems ?? [],
    filteredItems: filteredItems ?? [],
    ...query,
    invalidateItems,
  };
}

export default useItems;
