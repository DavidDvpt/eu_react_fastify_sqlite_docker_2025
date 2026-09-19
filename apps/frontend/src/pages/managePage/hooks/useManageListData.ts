import { useMemo } from "react";

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

  const contentValues = useMemo<ManageListDataResult>(() => {
    switch (activeTab) {
      case "type": {
        return {
          list: typesByCategory(categoryId) as ManageListRow[],
          isPending: isTypesPending,
          isError: isTypesError,
          columns: createTypeColumns() as GenericListColumn<ManageListRow>[],
          errorMessage: "Impossible de charger les types.",
          editRoute: (id) => `/manage/type/${id}/edit`,
          findEntityById: (id) => typeDatas?.find((row) => row.id === id),
        };
      }
      case "item":
        return {
          list: filteredItems({
            categoryId,
            typeId,
          }) as ManageListRow[],
          isPending: isItemsPending,
          isError: isItemsError,
          columns: createItemColumns() as GenericListColumn<ManageListRow>[],
          errorMessage: `Impossible de charger les items.`,
          editRoute: (id) => `/manage/item/${id}/edit`,
          findEntityById: (id) => itemDatas?.find((row) => row.id === id),
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
  ]);

  return contentValues;
}

export default useManageListData;
