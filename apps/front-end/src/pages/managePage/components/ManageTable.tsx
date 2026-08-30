import { GenericList } from "@/shared/components";

import { useLocation, useMatch, useNavigate, useParams } from "react-router-dom";
import type { ManageTab } from "@/shared/types/managePageTypes";
import useManageListData from "../hooks/useManageListData";
import CreateEditModal from "@/pages/managePage/components/createEditModal/CreateEditModal";

interface ManageTableProps {
  activeTab: ManageTab;
}

function ManageTable({ activeTab }: ManageTableProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isCreateRoute = Boolean(useMatch("/manage/:tab/create"));
  const isEditRoute = Boolean(useMatch("/manage/:tab/:id/edit"));

  const {
    list,
    columns,
    errorMessage,
    isError,
    isPending,
    editRoute,
    findEntityById,
  } = useManageListData({
    activeTab,
  });
  const editedEntity = findEntityById(id);

  type GenericListType = typeof list;

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col pb-2">
        <GenericList<GenericListType[number]>
          columns={columns}
          rows={list}
          getRowKey={(row) => row.id}
          hasHeader
          isLoading={isPending}
          isError={isError}
          loadingMessage="Chargement des categories..."
          errorMessage={errorMessage}
          emptyMessage="Aucune categorie."
          onRowClick={(row) =>
            navigate({
              pathname: editRoute(row.id),
              search: location.search,
            })
          }
        />
      </div>
      {(isCreateRoute || isEditRoute) && (
        <CreateEditModal tab={activeTab} entity={editedEntity} />
      )}
    </>
  );
}

export { ManageTable };
