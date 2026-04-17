import { GenericFilter } from "@/shared/components/GenericFilter";
import { useNavigate, useParams } from "react-router-dom";
import { ManageTable } from "./components/ManageTable";
import { Button } from "@/components/ui/button";
import { Panel } from "@/shared/components/Containers";

import type { FieldType } from "@/types";
import { useManageGenericFilter } from "@/shared/hooks";

function ManagePage() {
  const { tab } = useParams();
  const navigate = useNavigate();

  const selectedTab = tab as FieldType | undefined;
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
    <Panel>
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
        <div className="flex justify-end items-center py-2">
          <Button
            variant="primary"
            onClick={() => navigate(`/manage/${selectedTab}/create`)}
          >
            Créer
          </Button>
        </div>
      ) : null}

      <ManageTable
        activeTab={selectedTab ?? "category"}
        categories={categories}
        typesRows={filteredTypes}
        itemsRows={filteredItems}
        availability={availability}
      />
    </Panel>
  );
}

export default ManagePage;
