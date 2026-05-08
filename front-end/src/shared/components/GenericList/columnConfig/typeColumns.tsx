import type { GenericListColumn, ManageListRow } from "@/shared/types";
import { getScopeLabel } from "./scopeLabel";

const createTypeColumns = (
  currentUserId?: string
): GenericListColumn<ManageListRow>[] => [
  {
    key: "name",
    label: "Nom",
    width: "minmax(220px, 2fr)",
    render: (type) => type.name ?? "Unknown",
  },
  {
    key: "category",
    label: "Categorie",
    width: "minmax(220px, 2fr)",
    render: (row) => ("categoryName" in row ? row.categoryName : "unknown"),
  },
  {
    key: "scope",
    label: "Scope",
    width: "minmax(140px, 1fr)",
    render: (type) => getScopeLabel(type.userId, currentUserId),
  },
];

export { createTypeColumns };
