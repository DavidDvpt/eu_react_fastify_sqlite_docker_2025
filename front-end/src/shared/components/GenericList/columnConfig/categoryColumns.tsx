import type { Category, GenericListColumn } from "@/shared/types";
import { getScopeLabel } from "./scopeLabel";

const createCategoryColumns = (
  currentUserId?: string
): GenericListColumn<Category>[] => [
  {
    key: "name",
    label: "Nom",
    width: "minmax(240px, 2fr)",
    cellClassName: "text-table-body-text",
    render: (category) => category.name ?? "Unknow",
  },
  {
    key: "scope",
    label: "Scope",
    width: "minmax(140px, 1fr)",
    cellClassName: "text-table-body-text",
    render: (category) => getScopeLabel(category.userId, currentUserId),
  },
];

export { createCategoryColumns };
