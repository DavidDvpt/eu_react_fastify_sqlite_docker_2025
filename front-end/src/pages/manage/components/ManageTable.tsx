import {
  CATEGORIES_ROUTE,
  getCategoryEditRoute,
  getItemEditRoute,
  getTypeEditRoute,
  ITEMS_ROUTE,
  TYPES_ROUTE,
} from "@/pages/manage";
import { GenericTable } from "@/shared/components";

import { categoryColumns, itemColumns, typeColumns } from "./tableColumns";
import { useNavigate } from "react-router-dom";
import type { Category, Item, ManageTableProps, Type } from "@/types";

function ManageTable({
  activeTab,
  categories,
  typesRows,
  itemsRows,
  isCategoriesPending,
  isCategoriesError,
  isTypesPending,
  isTypesError,
  isItemsPending,
  isItemsError,
}: ManageTableProps) {
  const navigate = useNavigate();

  if (activeTab === "category") {
    return (
      <GenericTable<Category>
        columns={categoryColumns}
        rows={categories}
        getRowKey={(row) => row.id}
        isLoading={isCategoriesPending}
        isError={isCategoriesError}
        loadingMessage="Chargement des categories..."
        errorMessage={`Impossible de charger les categories (endpoint attendu: ${CATEGORIES_ROUTE}).`}
        emptyMessage="Aucune categorie."
        onRowClick={(row) => navigate(getCategoryEditRoute(row.id))}
      />
    );
  }

  if (activeTab === "type") {
    return (
      <GenericTable<Type>
        columns={typeColumns}
        rows={typesRows}
        getRowKey={(row) => row.id}
        isLoading={isTypesPending}
        isError={isTypesError}
        onRowClick={(row) => navigate(getTypeEditRoute(row.id))}
        loadingMessage="Chargement des types..."
        errorMessage={`Impossible de charger les types (endpoint attendu: ${TYPES_ROUTE}).`}
        emptyMessage="Aucun type."
      />
    );
  }

  return (
    <GenericTable<Item>
      columns={itemColumns}
      rows={itemsRows}
      getRowKey={(row) => row.id}
      isLoading={isItemsPending}
      isError={isItemsError}
      onRowClick={(row) => navigate(getItemEditRoute(row.id))}
      loadingMessage="Chargement des items..."
      errorMessage={`Impossible de charger les items (endpoint attendu: ${ITEMS_ROUTE}).`}
      emptyMessage="Aucun item."
    />
  );
}

export { ManageTable };
