import { useMemo } from "react";

import {
  useListItemsApiV2ItemsGet,
  useListTypesApiV2TypesGet,
  useRequestNexusUpdateApiV2TypesIdNexusUpdatePost,
} from "@/api/generated/react-query/entropiaManagerAPI";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import type { ManageListRow, ManageTab } from "@/shared/types/managePageTypes";
import type { GenericListColumn } from "@/shared/types";
import { useSystemDatas } from "@/shared/hooks";
import { createTypeColumns } from "@/shared/components/GenericList/columnDefinition/typeColumns";
import { createItemColumns } from "@/shared/components/GenericList/columnDefinition/itemColumns";
import { createCategoryColumns } from "@/shared/components/GenericList/columnDefinition/categoryColumns";

interface UseManageListData {
  activeTab: ManageTab;
  categoryId?: string;
  typeId?: string;
}
type ManageListDataResult = {
  list: ManageListRow[];
  columns: GenericListColumn<ManageListRow>[];
  isPending: boolean;
  isError: boolean;
  errorMessage: string;
  editRoute: (id: string) => string;
  findEntityById: (id?: string) => ManageListRow | undefined;
};

function useManageListData({
  activeTab,
  categoryId,
  typeId,
}: UseManageListData): ManageListDataResult {
  const {
    items: {
      isPending: isItemsPending,
      isError: isItemsError,
      filteredItems,
      itemDatas,
    },
    types: {
      typesByCategory,
      typeDatas,
      isPending: isTypesPending,
      isError: isTypesError,
    },
    categories: {
      isPending: isCategoriesPending,
      isError: isCategoriesError,
      data: cat,
    },
  } = useSystemDatas();
  const manageTypesQuery = useListTypesApiV2TypesGet(
    categoryId ? { categoryId } : undefined,
    {
      query: {
        enabled: activeTab === "type" && Boolean(categoryId),
        queryKey: ["types", "manage", categoryId],
        staleTime: Infinity,
      },
    },
  );
  const manageItemsQuery = useListItemsApiV2ItemsGet(
    typeId ? { typeId } : undefined,
    {
      query: {
        enabled: activeTab === "item" && Boolean(typeId),
        queryKey: ["items", "manage", typeId],
        staleTime: Infinity,
      },
    },
  );
  const nexusUpdateMutation = useRequestNexusUpdateApiV2TypesIdNexusUpdatePost({
    mutation: {
      onSuccess: () => InvalidateQueryAndKeys.typeMutation(),
    },
  });

  const contentValues = useMemo<ManageListDataResult>(() => {
    switch (activeTab) {
      case "type": {
        return {
          list: (manageTypesQuery.data
            ?.map((row) => ({
              ...row,
              category: row.category ?? cat?.find((category) => category.id === row.categoryId) ?? null,
            })) ?? typesByCategory(categoryId)) as ManageListRow[],
          isPending: categoryId ? manageTypesQuery.isPending : isTypesPending,
          isError: categoryId ? manageTypesQuery.isError : isTypesError,
          columns: createTypeColumns({
            onNexusUpdate: (id) => {
              void nexusUpdateMutation.mutateAsync({ id });
            },
            nexusUpdatePending: nexusUpdateMutation.isPending,
          }) as GenericListColumn<ManageListRow>[],
          errorMessage: "Impossible de charger les types.",
          editRoute: (id) => `/manage/type/${id}/edit`,
          findEntityById: (id) => (manageTypesQuery.data ?? typeDatas)?.find((row) => row.id === id) as ManageListRow | undefined,
        };
      }
      case "item":
        return {
          list: (manageItemsQuery.data ?? filteredItems({
            categoryId,
            typeId,
          })) as ManageListRow[],
          isPending: typeId ? manageItemsQuery.isPending : isItemsPending,
          isError: typeId ? manageItemsQuery.isError : isItemsError,
          columns: createItemColumns() as GenericListColumn<ManageListRow>[],
          errorMessage: `Impossible de charger les items.`,
          editRoute: (id) => `/manage/item/${id}/edit`,
          findEntityById: (id) => (manageItemsQuery.data ?? itemDatas)?.find((row) => row.id === id) as ManageListRow | undefined,
        };
      default:
      case "category":
        return {
          list: (cat ?? []) as ManageListRow[],
          isPending: isCategoriesPending,
          isError: isCategoriesError,
          columns:
            createCategoryColumns() as GenericListColumn<ManageListRow>[],
          errorMessage: `Impossible de charger les categories.`,
          editRoute: (id) => `/manage/category/${id}/edit`,
          findEntityById: (id) => (cat ?? []).find((row) => row.id === id),
        };
    }
  }, [
    activeTab,
    filteredItems,
    typesByCategory,
    itemDatas,
    typeDatas,
    isTypesPending,
    isItemsPending,
    isCategoriesPending,
    isTypesError,
    isItemsError,
    isCategoriesError,
    cat,
    categoryId,
    typeId,
    nexusUpdateMutation,
    manageTypesQuery.data,
    manageTypesQuery.isPending,
    manageTypesQuery.isError,
    manageItemsQuery.data,
    manageItemsQuery.isPending,
    manageItemsQuery.isError,
  ]);

  return contentValues;
}

export default useManageListData;
