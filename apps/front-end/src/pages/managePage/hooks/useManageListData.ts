import { useMemo } from "react";

import useGenericFilterParams from "@/shared/components/GenericFilter/useGenericFilterParams";

import type { ManageListRow, ManageTab } from "@/shared/types/managePageTypes";
import type { GenericListColumn } from "@/shared/types";
import { useSystemDatas } from "@/shared/hooks";
import { createTypeColumns } from "@/shared/components/GenericList/columnDefinition/typeColumns";
import { createItemColumns } from "@/shared/components/GenericList/columnDefinition/itemColumns";
import { createCategoryColumns } from "@/shared/components/GenericList/columnDefinition/categoryColumns";

interface UseManageListData {
  activeTab: ManageTab;
}
type ManageListDataResult = {
  list: ManageListRow[];
  columns: GenericListColumn<ManageListRow>[];
  isPending: boolean;
  isError: boolean;
  errorMessage: string;
  editRoute: (id: string) => string;
};

function useManageListData({
  activeTab,
}: UseManageListData): ManageListDataResult {
  const { params } = useGenericFilterParams();

  const {
    items: { isPending: isItemsPending, isError: isItemsError, filteredItems },
    types: {
      typesByCategory,
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
          list: typesByCategory(params.category) as ManageListRow[],
          isPending: isTypesPending,
          isError: isTypesError,
          columns: createTypeColumns() as GenericListColumn<ManageListRow>[],
          errorMessage: "Impossible de charger les types.",
          editRoute: (id) => `/manage/type/${id}/edit`,
        };
      }
      case "item":
        return {
          list: filteredItems({
            categoryId: params.category,
            typeId: params.type,
          }) as ManageListRow[],
          isPending: isItemsPending,
          isError: isItemsError,
          columns: createItemColumns() as GenericListColumn<ManageListRow>[],
          errorMessage: `Impossible de charger les items.`,
          editRoute: (id) => `/manage/item/${id}/edit`,
        };
      default:
      case "category":
        return {
          list: cat as ManageListRow[],
          isPending: isCategoriesPending,
          isError: isCategoriesError,
          columns: createCategoryColumns() as GenericListColumn<ManageListRow>[],
          errorMessage: `Impossible de charger les categories.`,
          editRoute: (id) => `/manage/category/${id}/edit`,
        };
    }
  }, [
    activeTab,
    filteredItems,
    typesByCategory,
    isTypesPending,
    isItemsPending,
    isCategoriesPending,
    isTypesError,
    isItemsError,
    isCategoriesError,
    cat,
    params,
  ]);

  return contentValues;
}

export default useManageListData;
