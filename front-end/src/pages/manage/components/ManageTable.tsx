import {
  CATEGORIES_ROUTE,
  getCategoryEditRoute,
  getItemEditRoute,
  getTypeEditRoute,
  ITEMS_ROUTE,
  TYPES_ROUTE,
} from "@/pages/manage";
import { GenericList } from "@/shared/components";

import {
  categoryColumns,
  itemColumns,
  typeColumns,
} from "../../../shared/components/GenericList/columnConfig";
import { useNavigate } from "react-router-dom";
import type { Category, ManageTableProps, Type } from "@/types";
import { ManageItemsList } from "./ManageItemsList";

function ManageTable({
  activeTab,
  categories,
  typesRows,
  itemsRows,
  availability,
}: ManageTableProps) {
  const navigate = useNavigate();
  const [categoriesStatus, typesStatus, itemsStatus] = availability;
  const status =
    activeTab === "category"
      ? categoriesStatus
      : activeTab === "type"
        ? typesStatus
        : itemsStatus;

  if (activeTab === "category") {
    return (
      <GenericList<Category>
        columns={categoryColumns}
        rows={categories}
        getRowKey={(row) => row.id}
        isLoading={status?.isPending ?? false}
        isError={status?.isError ?? false}
        loadingMessage="Chargement des categories..."
        errorMessage={`Impossible de charger les categories (endpoint attendu: ${CATEGORIES_ROUTE}).`}
        emptyMessage="Aucune categorie."
        onRowClick={(row) => navigate(getCategoryEditRoute(row.id))}
      />
    );
  }

  if (activeTab === "type") {
    return (
      <GenericList<Type>
        columns={typeColumns}
        rows={typesRows}
        getRowKey={(row) => row.id}
        isLoading={status?.isPending ?? false}
        isError={status?.isError ?? false}
        onRowClick={(row) => navigate(getTypeEditRoute(row.id))}
        loadingMessage="Chargement des types..."
        errorMessage={`Impossible de charger les types (endpoint attendu: ${TYPES_ROUTE}).`}
        emptyMessage="Aucun type."
      />
    );
  }

  return (
    <ManageItemsList
      columns={itemColumns}
      rows={itemsRows}
      isLoading={status?.isPending ?? false}
      isError={status?.isError ?? false}
      loadingMessage="Chargement des items..."
      errorMessage={`Impossible de charger les items (endpoint attendu: ${ITEMS_ROUTE}).`}
      emptyMessage="Aucun item."
      onRowClick={(row) => navigate(getItemEditRoute(row.id))}
    />
  );
}

export { ManageTable };
