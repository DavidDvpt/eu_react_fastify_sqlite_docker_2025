import { GenericFilter } from "@/shared/components";
import { useNavigate, useParams } from "react-router-dom";
import { ManageTable } from "./components/ManageTable";
import { Button } from "@/components/ui/button";
import { Panel } from "@/shared/components/Containers";

import type { ManageTab } from "@/types";
import { useManageGenericFilter } from "@/shared/hooks";

function ManagePage() {
  const { tab } = useParams();
  const navigate = useNavigate();

  const selectedTab = tab as ManageTab | undefined;
  const {
    model,
    categories,
    filteredTypes,
    filteredItems,
    filter,
    allowedFields,
    showFilter,
    hasIsLimited,
    availability,
  } = useManageGenericFilter(selectedTab);

  const canCreate =
    selectedTab === "category" ||
    selectedTab === "type" ||
    selectedTab === "item";

  return (
    <Panel className="flex h-full min-h-0 flex-col">
      {showFilter ? (
        <GenericFilter
          model={model}
          filter={filter}
          allowedFields={allowedFields}
          hasAutocomplete
          hasIsLimited={hasIsLimited}
        />
      ) : null}

      {canCreate ? (
        <div className="flex items-center justify-end py-2">
          <Button
            variant="primary"
            onClick={() => navigate(`/manage/${selectedTab}/create`)}
          >
            Créer
          </Button>
        </div>
      ) : null}

      <div className="flex-1 min-h-0">
        <ManageTable
          activeTab={selectedTab ?? "category"}
          categories={categories}
          typesRows={filteredTypes}
          itemsRows={filteredItems}
          availability={availability}
        />
      </div>
    </Panel>
  );
}

export default ManagePage;
