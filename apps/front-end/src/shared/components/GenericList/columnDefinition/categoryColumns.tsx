import { getScopeLabel } from "@/shared/components/GenericList/columnDefinition/scopeLabel";
import type { GenericListColumn } from "@/shared/types";
import type { CategoryDto } from "@eu/types";

const createCategoryColumns = (
  currentUserId?: string,
): GenericListColumn<CategoryDto>[] => [
  {
    key: "name",
    label: "Nom",
    kind: "text",
    accessor: "name",
    fillRemainingSpace: true,
    minWidth: 240,
    bodyCellClassName: "text-black",
    value: (category) => category.name ?? "Unknow",
  },
  {
    key: "scope",
    label: "Scope",
    accessor: "userId",
    minWidth: 140,
    maxWidth: 140,
    bodyCellClassName: "text-black",
    kind: "text",
    value: (category) => getScopeLabel(category.userId, currentUserId),
  },
];

export { createCategoryColumns };
