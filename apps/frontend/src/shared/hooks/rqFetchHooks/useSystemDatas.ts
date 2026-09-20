import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import {
  useListCategoriesApiV2CategoriesGet,
  useListItemsApiV2ItemsGet,
  useListTypesApiV2TypesGet,
} from "@/api/generated/react-query/entropiaManagerAPI";
import { useAppSelector } from "@/store/hooks";
import { selectIsLoggued } from "@/store/reducers/auth";
import type {
  CategoryViewModels,
  ItemViewModels,
  TypeViewModels,
} from "@zod-schemas";
import { useMemo } from "react";

export default function useSystemDatas() {
  const logged = useAppSelector(selectIsLoggued);

  const keys = InvalidateQueryAndKeys;

  /* CATEGORIES */
  const categories = useListCategoriesApiV2CategoriesGet(undefined, {
    query: {
      queryKey: keys.getCategoriesKey().keys,
      enabled: logged,
      staleTime: Infinity,
    },
  });

  /* TYPES */
  const t = useListTypesApiV2TypesGet(undefined, {
    query: {
      queryKey: keys.getTypesKey().keys,
      enabled: logged,
      staleTime: Infinity,
    },
  });

  // The generated OpenAPI models describe the transport response. Keep the
  // existing domain model at this boundary so the rest of the application
  // keeps receiving the same normalized shape as before the migration.
  const categoryData = categories.data as CategoryViewModels | undefined;
  const typeData = t.data as TypeViewModels | undefined;

  const types = useMemo(() => {
    const enrich =
      typeData?.map((m) => {
        const c = categoryData?.find((f) => f.id === m.categoryId);
        return { ...m, category: c };
      }) ?? [];

    return enrich;
  }, [categoryData, typeData]);

  const typesByCategory = useMemo(
    () => (categoryId?: string) => {
      if (!categoryId) return types;
      return types.filter((f) => f.categoryId === categoryId);
    },
    [types],
  );

  /* ITEMS */
  const i = useListItemsApiV2ItemsGet(undefined, {
    query: {
      queryKey: keys.getItemsKey().keys,
      enabled: logged,
      staleTime: Infinity,
    },
  });
  const itemData = i.data as ItemViewModels | undefined;
  const items = useMemo(() => {
    const enrich =
      itemData?.map((m) => {
        const type = types?.find((ft) => m.typeId === ft.id);

        return {
          ...m,
          type,
        };
      }) ?? [];

    return enrich as ItemViewModels;
  }, [itemData, types]);
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
    categories: { ...categories, data: categoryData },
    types: { ...t, typeDatas: types, typesByCategory },
    items: { ...i, itemDatas: items, filteredItems },
  };
}
