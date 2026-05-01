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
  const {
    categories,
    isPending: isCategoriesPending,
    isError: isCategoriesError,
  } = useCategories();
  const {
    types,
    isPending: isTypesPending,
    isError: isTypesError,
  } = useTypes();
  const {
    items,
    isPending: isItemsPending,
    isError: isItemsError,
  } = useItems();

  const contentValues = useMemo(() => {
    switch (activeTab) {
      case "type":
        return {
          list: types,
          isPending: isTypesPending,
          isError: isTypesError,
          columns: typeColumns,
          errorMessage: `Impossible de charger les types (endpoint attendu: ${TYPES_ROUTE}).`,
          editRoute: getTypeEditRoute,
        };
      case "item":
        return {
          list: items,
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
    types,
    items,
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
