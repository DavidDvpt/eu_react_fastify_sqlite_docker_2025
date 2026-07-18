import { getScopeLabel } from "@/shared/components/GenericList/columnDefinition/scopeLabel";
import type { Category, GenericListColumn } from "@/shared/types";

const createCategoryColumns = (
  currentUserId?: string,
): GenericListColumn<Category>[] => [
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
