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
  // Detail fields are exposed by the same OpenAPI endpoint through the
  // `detail` query parameter. Each detail query only returns values for the
  // matching item type, so merge them into the base item collection below.
  const finderDetails = useListItemsApiV2ItemsGet(
    { detail: "finderDetail" },
    { query: { enabled: logged, staleTime: Infinity } },
  );
  const finderAmplifierDetails = useListItemsApiV2ItemsGet(
    { detail: "finderAmplifierDetails" },
    { query: { enabled: logged, staleTime: Infinity } },
  );
  const excavatorDetails = useListItemsApiV2ItemsGet(
    { detail: "excavatorDetail" },
    { query: { enabled: logged, staleTime: Infinity } },
  );
  const refinerDetails = useListItemsApiV2ItemsGet(
    { detail: "refinerDetail" },
    { query: { enabled: logged, staleTime: Infinity } },
  );
  const enhancerDetails = useListItemsApiV2ItemsGet(
    { detail: "enhancerDetails" },
    { query: { enabled: logged, staleTime: Infinity } },
  );
  const itemData = i.data as ItemViewModels | undefined;
  const items = useMemo(() => {
    const detailsById = new Map<string, ItemViewModels[number]>();
    const detailData = [
      finderDetails.data,
      finderAmplifierDetails.data,
      excavatorDetails.data,
      refinerDetails.data,
      enhancerDetails.data,
    ];
    detailData.forEach((itemsWithDetails) => {
      itemsWithDetails?.forEach((detailItem) => {
        detailsById.set(detailItem.id, detailItem as ItemViewModels[number]);
      });
    });

    const enrich =
      itemData?.map((m) => {
        const type = types?.find((ft) => m.typeId === ft.id);
        const detail = detailsById.get(m.id);

        return {
          ...m,
          ...detail,
          // Detail responses intentionally omit the item type relation.
          type,
        };
      }) ?? [];

    return enrich as ItemViewModels;
  }, [
    itemData,
    types,
    finderDetails.data,
    finderAmplifierDetails.data,
    excavatorDetails.data,
    refinerDetails.data,
    enhancerDetails.data,
  ]);
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
