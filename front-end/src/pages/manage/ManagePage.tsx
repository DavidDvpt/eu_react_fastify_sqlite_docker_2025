import { GenericFilter } from "@/shared/components";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Panel } from "@/shared/components/Containers";

import type { ManageTab } from "@/shared/types";
import { ManageTable } from "./components/ManageTable";

function ManagePage() {
  const { tab } = useParams();
  const navigate = useNavigate();

  const selectedTab = (tab as ManageTab) ?? "category";

  const canCreate =
    selectedTab === "category" ||
    selectedTab === "type" ||
    selectedTab === "item";

  return (
    <Panel className="flex h-full min-h-0 flex-col">
      {selectedTab !== "category" && <GenericFilter />}

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
        <ManageTable activeTab={selectedTab} />
      </div>
    </Panel>
  );
}

export default ManagePage;
