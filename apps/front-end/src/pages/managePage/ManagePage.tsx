import { GenericFilter } from "@/shared/components";
import { Panel, Section } from "@/shared/components/Containers";
import { useQueryParams } from "@/shared/hooks";

import type { GenericFilterContext } from "@/shared/types";
import StringTools from "@/shared/tools/stringTools";
import type { ManageTab } from "@/shared/types/managePageTypes";
import { ManageTable } from "./components/ManageTable";
import { useParams } from "react-router-dom";
import { managePageQuerySchema } from "./managePageSchema";

function ManagePage() {
  const { tab } = useParams();
  const params = useQueryParams();
  const queries = managePageQuerySchema.parse(params);

  const selectedTab = (tab as ManageTab) ?? "category";
  const hasSelectedCategory = Boolean(queries.categoryId);
  const hasSelectedType = Boolean(queries.typeId);

  const context =
    `manage${StringTools.capitalizeFirstLetter(selectedTab)}` as GenericFilterContext;

  const shouldShowTable =
    selectedTab === "category" ||
    (selectedTab === "type" && hasSelectedCategory) ||
    (selectedTab === "item" && hasSelectedType);

  const emptySelectionMessage =
    selectedTab === "type"
      ? "Selectionner une categorie"
      : selectedTab === "item"
        ? "Selectionner un type"
        : "Selectionner une categorie ou un type";

  return (
    <Panel className="min-h-0 gap-2">
      <GenericFilter context={context} className="m-0" />

      {shouldShowTable ? (
        <ManageTable activeTab={selectedTab} {...queries} />
      ) : (
        <Section className="flex min-h-0 flex-1 items-center justify-center text-center text-black">
          {emptySelectionMessage}
        </Section>
      )}
    </Panel>
  );
}

export default ManagePage;
