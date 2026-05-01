import { GenericList } from "@/shared/components";

import { useNavigate } from "react-router-dom";
import type { ManageTab } from "@/shared/types";

import useManageListData from "@/pages/manage/__tests__/useManageList";

interface ManageTableProps {
  activeTab: ManageTab;
}

function ManageTable({ activeTab }: ManageTableProps) {
  const navigate = useNavigate();

  const { list, columns, errorMessage, isError, isPending, editRoute } =
    useManageListData({
      activeTab,
    });

  type GenericListType = typeof list;

  return (
    <GenericList<GenericListType[number]>
      columns={columns}
      rows={list}
      getRowKey={(row) => row.id}
      isLoading={isPending}
      isError={isError}
      loadingMessage="Chargement des categories..."
      errorMessage={errorMessage}
      emptyMessage="Aucune categorie."
      onRowClick={(row) => navigate(editRoute(row.id))}
    />
  );

  // if (activeTab === "type") {
  //   return (
  //     <GenericList<Type>
  //       columns={typeColumns}
  //       rows={typesRows}
  //       getRowKey={(row) => row.id}
  //       isLoading={status?.isPending ?? false}
  //       isError={status?.isError ?? false}
  //       onRowClick={(row) => navigate(getTypeEditRoute(row.id))}
  //       loadingMessage="Chargement des types..."
  //       errorMessage={`Impossible de charger les types (endpoint attendu: ${TYPES_ROUTE}).`}
  //       emptyMessage="Aucun type."
  //     />
  //   );
  // }

  // return (
  //   <ManageItemsList
  //     columns={itemColumns}
  //     rows={itemsRows}
  //     isLoading={status?.isPending ?? false}
  //     isError={status?.isError ?? false}
  //     loadingMessage="Chargement des items..."
  //     errorMessage={`Impossible de charger les items (endpoint attendu: ${ITEMS_ROUTE}).`}
  //     emptyMessage="Aucun item."
  //     onRowClick={(row) => navigate(getItemEditRoute(row.id))}
  //   />
  // );
}

export { ManageTable };
