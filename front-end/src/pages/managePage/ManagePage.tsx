import { GenericFilter } from "@/shared/components";
import { Panel } from "@/shared/components/Containers";

import type { GenericFilterContext } from "@/shared/types";
import StringTools from "@/shared/tools/stringTools";
import type { ManageTab } from "@/shared/types/managePageTypes";
import { ManageTable } from "./components/ManageTable";
import { useParams } from "react-router-dom";

function ManagePage() {
  const { tab } = useParams();

  const selectedTab = (tab as ManageTab) ?? "category";

  const context =
    `manage${StringTools.capitalizeFirstLetter(selectedTab)}` as GenericFilterContext;

  return (
    <Panel className="min-h-0 gap-2">
      {selectedTab !== "category" && (
        <GenericFilter context={context} className="m-0" />
      )}

      <ManageTable activeTab={selectedTab} />
    </Panel>
  );
}

export default ManagePage;
