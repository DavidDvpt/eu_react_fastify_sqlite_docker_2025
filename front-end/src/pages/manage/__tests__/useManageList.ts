import { useMemo } from "react";
import useCategories from "../../../shared/hooks/useCategories";
import useItems from "../../../shared/hooks/useItems";
import useTypes from "../../../shared/hooks/useTypes";

import {
  CATEGORIES_ROUTE,
  getCategoryEditRoute,
  getItemEditRoute,
  getTypeEditRoute,
  ITEMS_ROUTE,
  TYPES_ROUTE,
} from "@/pages/manage";

import type {
  GenericListColumn,
  ManageListRow,
  ManageTab,
} from "../../../shared/types";
import {
  categoryColumns,
  itemColumns,
  typeColumns,
} from "../../../shared/components/GenericList/columnConfig";

import useGenericFilterParams from "@/shared/components/GenericFilter/useGenericFilterParams";

interface UseManageListData {
  activeTab: ManageTab;
}
function useManageListData({ activeTab }: UseManageListData): {
  list: ManageListRow[];
  columns: GenericListColumn<ManageListRow>[];
  isPending: boolean;
  isError: boolean;
  errorMessage: string;
  editRoute: (id: string) => string;
} {
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

  const contentValues = useMemo(() => {
    switch (activeTab) {
      case "type":
        return {
          list: filteredTypes,
          isPending: isTypesPending,
          isError: isTypesError,
          columns: typeColumns,
          errorMessage: `Impossible de charger les types (endpoint attendu: ${TYPES_ROUTE}).`,
          editRoute: getTypeEditRoute,
        };
      case "item":
        return {
          list: filteredItems,
          isPending: isItemsPending,
          isError: isItemsError,
          columns: itemColumns,
          errorMessage: `Impossible de charger les items (endpoint attendu: ${ITEMS_ROUTE}).`,
          editRoute: getItemEditRoute,
        };
      default:
      case "category":
        return {
          list: categories,
          isPending: isCategoriesPending,
          isError: isCategoriesError,
          columns: categoryColumns,
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
  ]);

  return { ...contentValues, list: contentValues?.list ?? [] };
}

export default useManageListData;
