import { useMemo } from "react";

import { useAppSelector } from "@/store/hooks";

import useGenericFilterParams from "@/shared/components/GenericFilter/useGenericFilterParams";

import type { ManageListRow, ManageTab } from "@/shared/types/managePageTypes";
import type { GenericListColumn } from "@/shared/types";
import { useSystemDatas } from "@/shared/hooks";
import { createTypeColumns } from "@/shared/components/GenericList/columnDefinition/typeColumns";
import { getTypeEditRoute, TYPES_ROUTE } from "@/lib/services/typesApi";
import { createItemColumns } from "@/shared/components/GenericList/columnDefinition/itemColumns";
import { getItemEditRoute, ITEMS_ROUTE } from "@/lib/services/itemsApi";
import { createCategoryColumns } from "@/shared/components/GenericList/columnDefinition/categoryColumns";
import {
  CATEGORIES_ROUTE,
  getCategoryEditRoute,
} from "@/lib/services/categoryApi";

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
  const currentUserId = useAppSelector((state) => state.auth.user.result?.id);
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
      case "type":
        return {
          list: typesByCategory(params.category) as ManageListRow[],
          isPending: isTypesPending,
          isError: isTypesError,
          columns: createTypeColumns(
            currentUserId,
          ) as GenericListColumn<ManageListRow>[],
          errorMessage: `Impossible de charger les types (endpoint attendu: ${TYPES_ROUTE}).`,
          editRoute: getTypeEditRoute,
        };
      case "item":
        return {
          list: filteredItems({
            categoryId: params.category,
            typeId: params.type,
          }) as ManageListRow[],
          isPending: isItemsPending,
          isError: isItemsError,
          columns: createItemColumns(
            currentUserId,
          ) as GenericListColumn<ManageListRow>[],
          errorMessage: `Impossible de charger les items (endpoint attendu: ${ITEMS_ROUTE}).`,
          editRoute: getItemEditRoute,
        };
      default:
      case "category":
        return {
          list: cat as ManageListRow[],
          isPending: isCategoriesPending,
          isError: isCategoriesError,
          columns: createCategoryColumns(
            currentUserId,
          ) as GenericListColumn<ManageListRow>[],
          errorMessage: `Impossible de charger les categories (endpoint attendu: ${CATEGORIES_ROUTE}).`,
          editRoute: getCategoryEditRoute,
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
    currentUserId,
    cat,
    params,
  ]);

  return contentValues;
}

export default useManageListData;
