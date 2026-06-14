import { getScopeLabel } from "@/shared/components/GenericList/columnDefinition/scopeLabel";
import type { Type, GenericListColumn } from "@/shared/types";

const createTypeColumns = (
  currentUserId?: string,
): GenericListColumn<Type>[] => [
  {
    key: "name",
    label: "Nom",
    kind: "text",
    accessor: "name",
    fillRemainingSpace: true,
    minWidth: 320,
    bodyCellClassName: "text-black",
    value: (type) => type.name ?? "Unknown",
  },
  {
    key: "category",
    label: "Categorie",
    kind: "text",
    minWidth: 320,
    maxWidth: 320,
    bodyCellClassName: "text-black",
    value: (row) => ("categoryName" in row ? row.categoryName : "Unknown"),
  },
  {
    key: "scope",
    label: "Scope",
    kind: "text",
    accessor: "userId",
    minWidth: 140,
    maxWidth: 140,
    bodyCellClassName: "text-black",
    value: (type) => getScopeLabel(type.userId, currentUserId),
  },
];

export { createTypeColumns };
