import { GenericList } from "@/shared/components";

import { useNavigate } from "react-router-dom";
import type { ManageTab } from "@/shared/types/managePageTypes";
import useManageListData from "../hooks/useManageListData";

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
    <div className="flex min-h-0 flex-1 flex-col pb-2">
      <GenericList<GenericListType[number]>
        columns={columns}
        rows={list}
        getRowKey={(row) => row.id}
        isLoading={isPending}
        isError={isError}
        loadingMessage="Chargement des categories..."
        errorMessage={errorMessage}
        emptyMessage="Aucune categorie."
        rowHeight={34}
        onRowClick={(row) => navigate(editRoute(row.id))}
      />
    </div>
  );
}

export { ManageTable };
