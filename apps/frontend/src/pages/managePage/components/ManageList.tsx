import { GenericList } from "@/shared/components";
import { Section } from "@/shared/components/Containers";

import {
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import type { ManageTab } from "@/shared/types/managePageTypes";
import useManageListData from "../hooks/useManageListData";
import CreateEditModal from "@/pages/managePage/components/createEditModal/CreateEditModal";
import type { ManagePageQuery } from "../managePageSchema";

interface ManageListProps extends ManagePageQuery {
  activeTab: ManageTab;
}

function ManageList({ activeTab, categoryId, typeId }: ManageListProps) {
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
    categoryId,
    typeId,
  });
  const editedEntity = findEntityById(id);

  type GenericListType = typeof list;

  return (
    <>
      <Section className="min-h-0 flex-1 pb-2">
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
      </Section>
      {(isCreateRoute || isEditRoute) && (
        <CreateEditModal tab={activeTab} entity={editedEntity} />
      )}
    </>
  );
}

export { ManageList };
