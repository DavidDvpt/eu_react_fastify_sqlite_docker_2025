import { useMemo } from "react";
import useCategories from "../../../shared/hooks/useCategories";
import useItems from "../../../shared/hooks/useItems";
import useTypes from "../../../shared/hooks/useTypes";

import type { GenericListColumn } from "../../../shared/types";

import { useAppSelector } from "@/store/hooks";

import useGenericFilterParams from "@/shared/components/GenericFilter/useGenericFilterParams";
import {
  CATEGORIES_ROUTE,
  getCategoryEditRoute,
  getItemEditRoute,
  getTypeEditRoute,
  ITEMS_ROUTE,
  TYPES_ROUTE,
} from "../services";
import type {
  ManageListRow,
  ManageTab,
} from "../../../shared/types/managePageTypes";
import {
  createCategoryColumns,
  createItemColumns,
  createTypeColumns,
} from "../configs";

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
    categories,
    isPending: isCategoriesPending,
    isError: isCategoriesError,
  } = useCategories();
  const {
    filteredTypes,
    isPending: isTypesPending,
    isError: isTypesError,
  } = useTypes({ categoryId: params.category });
  const {
    filteredItems,
    isPending: isItemsPending,
    isError: isItemsError,
  } = useItems({ typeId: params.type });

  const contentValues = useMemo<ManageListDataResult>(() => {
    switch (activeTab) {
      case "type":
        return {
          list: filteredTypes as ManageListRow[],
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
          list: filteredItems as ManageListRow[],
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
          list: categories as ManageListRow[],
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
    filteredTypes,
    filteredItems,
    categories,
    isTypesPending,
    isItemsPending,
    isCategoriesPending,
    isTypesError,
    isItemsError,
    isCategoriesError,
    currentUserId,
  ]);

  return contentValues;
}

export default useManageListData;
