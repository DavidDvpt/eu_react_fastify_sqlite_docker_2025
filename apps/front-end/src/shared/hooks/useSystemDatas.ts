import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import { CategoriesApi, ItemsApi, TypesApi } from "@/shared/services";
import { useAppSelector } from "@/store/hooks";
import { selectIsLoggued } from "@/store/reducers/auth";
import type { ItemDtos } from "@eu/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function useSystemDatas() {
  const logged = useAppSelector(selectIsLoggued);

  const keys = InvalidateQueryAndKeys;
  const catApi = new CategoriesApi();
  const typesApi = new TypesApi();
  const itemsApi = new ItemsApi();
  /* CATEGORIES */
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: () => catApi.get(),
    enabled: logged,
    staleTime: Infinity,
  });

  /* TYPES */
  const t = useQuery({
    queryKey: keys.getTypesKey().keys,
    queryFn: () => typesApi.get(),
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

  const typesByCategory = useMemo(
    () => (categoryId?: string) => {
      if (!categoryId) return types;
      return types.filter((f) => f.categoryId === categoryId);
    },
    [types],
  );

  /* ITEMS */
  const i = useQuery({
    queryKey: keys.getItemsKey().keys,
    queryFn: () => itemsApi.get(),
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

  return {
    categories,
    types: { ...t, typeDatas: types, typesByCategory },
    items: { ...i, itemDatas: items, filteredItems },
  };
}
