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
    width: 240,
    bodyCellClassName: "text-black",
    value: (category) => category.name ?? "Unknow",
  },
  {
    key: "scope",
    label: "Scope",
    accessor: "userId",
    width: 140,
    bodyCellClassName: "text-black",
    kind: "text",
    value: (category) => getScopeLabel(category.userId, currentUserId),
  },
];

export { createCategoryColumns };
