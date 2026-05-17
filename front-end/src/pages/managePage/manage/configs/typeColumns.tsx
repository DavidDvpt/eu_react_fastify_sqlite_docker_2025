import type { Type, GenericListColumn } from "@/shared/types";
import { getScopeLabel } from "./scopeLabel";

const createTypeColumns = (
  currentUserId?: string,
): GenericListColumn<Type>[] => [
  {
    key: "name",
    label: "Nom",
    kind: "text",
    accessor: "name",
    width: 320,
    bodyCellClassName: "text-black",
    value: (type) => type.name ?? "Unknown",
  },
  {
    key: "category",
    label: "Categorie",
    kind: "text",
    width: 320,
    bodyCellClassName: "text-black",
    value: (row) => ("categoryName" in row ? row.categoryName : "Unknown"),
  },
  {
    key: "scope",
    label: "Scope",
    kind: "text",
    accessor: "userId",
    width: 140,
    bodyCellClassName: "text-black w-[150px]",
    value: (type) => getScopeLabel(type.userId, currentUserId),
  },
];

export { createTypeColumns };
