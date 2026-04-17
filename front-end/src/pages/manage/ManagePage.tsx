import { useState } from "react";
import { GenericFilter } from "@/shared/components/GenericFilter";
import { useNavigate, useParams } from "react-router-dom";
import { ManageTable } from "./components/ManageTable";
import { Button } from "@/components/ui/button";
import { Panel } from "@/shared/components/Containers";
import { Switch } from "@/components/ui/switch";

import type { FieldType } from "@/types";
import { useManageGenericFilter } from "@/shared/hooks";

function ManagePage() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const [isCardView, setIsCardView] = useState(false);

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
  const showViewSwitch = selectedTab === "item";

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
        <div
          className={`flex items-center py-2 ${
            showViewSwitch ? "justify-between" : "justify-end"
          }`}
        >
          {showViewSwitch ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-text">Ligne</span>
              <Switch
                checked={isCardView}
                onCheckedChange={setIsCardView}
                aria-label="Basculer entre affichage ligne et carte"
              />
              <span className="text-sm text-text">Carte</span>
            </div>
          ) : null}
          <Button
            variant="primary"
            onClick={() => navigate(`/manage/${selectedTab}/create`)}
          >
            Créer
          </Button>
        </div>
      ) : null}

      <div data-view={isCardView ? "card" : "row"}>
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
