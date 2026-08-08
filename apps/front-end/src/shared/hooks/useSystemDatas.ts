import { getCategories, getItems, getTypes } from "@/lib/services";
import { useAppSelector } from "@/store/hooks";
import { selectIsLoggued } from "@/store/reducers/auth";
import type { ItemDtos } from "@eu/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

export default function useSystemDatas() {
  const logged = useAppSelector(selectIsLoggued);
  const queryClient = useQueryClient();

  /* CATEGORIES */
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: logged,
    staleTime: Infinity,
  });
  const invalidateCategories = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
    [queryClient],
  );

  /* TYPES */
  const t = useQuery({
    queryKey: ["types"],
    queryFn: getTypes,
    enabled: logged,
    staleTime: Infinity,
  });

  const types = useMemo(() => {
    const enrich =
      t.data?.map((m) => {
        const c = categories.data?.find((f) => f.id === m.categoryId);
        return { ...m, category: c };
      }) ?? [];

    return enrich;
  }, [categories, t.data]);
  const invalidateTypes = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["types"] }),
    [queryClient],
  );
  const typesByCategory = useMemo(
    () => (categoryId?: string) => {
      if (!categoryId) return types;
      return types.filter((f) => f.categoryId === categoryId);
    },
    [types],
  );

  /* ITEMS */
  const i = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
    enabled: logged,
    staleTime: Infinity,
  });
  const items = useMemo(() => {
    const enrich =
      i.data?.map((m) => {
        const type = types?.find((ft) => m.typeId === ft.id);

        return {
          ...m,
          type,
        };
      }) ?? [];

    return enrich as ItemDtos;
  }, [i.data, types]);
  const filteredItems = useMemo(
    () =>
      ({
        typeId,
        categoryId,
      }: { typeId?: string; categoryId?: string } = {}) => {
        if (typeId) {
          return items.filter((f) => f.typeId === typeId);
        }
        if (categoryId) {
          return items.filter((f) => f.type?.categoryId === categoryId);
        }
        return items;
      },
    [items],
  );
  const invalidateItems = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["items"] }),
    [queryClient],
  );

  return {
    categories,
    types: { ...t, typeDatas: types, typesByCategory },
    items: { ...i, itemDatas: items, filteredItems },

    invalidateCategories,
    invalidateTypes,
    invalidateItems,
  };
}
