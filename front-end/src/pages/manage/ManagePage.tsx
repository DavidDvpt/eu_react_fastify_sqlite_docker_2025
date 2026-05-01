import { GenericFilter } from "@/shared/components";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Panel } from "@/shared/components/Containers";

import type { GenericFilterContext, ManageTab } from "@/shared/types";
import { ManageTable } from "./components/ManageTable";
import { MANAGE_TABS } from "./managePage.utils";
import StringTools from "@/shared/tools/stringTools";

function ManagePage() {
  const { tab } = useParams();
  const navigate = useNavigate();

  const selectedTab = (tab as ManageTab) ?? "category";

  const canCreate = MANAGE_TABS.includes(selectedTab);
  const context =
    `manage${StringTools.capitalizeFirstLetter(selectedTab)}` as GenericFilterContext;

  return (
    <Panel className="flex h-full min-h-0 flex-col">
      {selectedTab !== "category" && <GenericFilter context={context} />}

      {canCreate ? (
        <div className="flex items-center justify-end py-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/manage/${selectedTab}/create`)}
          >
            Créer
          </Button>
        </div>
      ) : null}

      <div className="flex-1 min-h-0">
        <ManageTable activeTab={selectedTab} />
      </div>
    </Panel>
  );
}

export default ManagePage;
