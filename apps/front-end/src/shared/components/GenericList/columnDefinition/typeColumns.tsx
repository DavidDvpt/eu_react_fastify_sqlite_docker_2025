import { getScopeLabel } from "@/shared/components/GenericList/columnDefinition/scopeLabel";
import type { GenericListColumn } from "@/shared/types";
import type { TypeDto } from "@eu/types";

const createTypeColumns = (
  currentUserId?: string,
): GenericListColumn<TypeDto>[] => [
  {
    key: "name",
    label: "Nom",
    kind: "text",
    accessor: "name",
    fillRemainingSpace: true,
    minWidth: 320,
    bodyCellClassName: "text-black",
  },
  {
    key: "category",
    label: "Categorie",
    kind: "text",
    minWidth: 320,
    maxWidth: 320,
    bodyCellClassName: "text-black",
    value: (row) => row.category?.name ?? "unknown",
  },
  {
    key: "scope",
    label: "Scope",
    kind: "text",
    minWidth: 140,
    maxWidth: 140,
    bodyCellClassName: "text-black",
    value: (type) => getScopeLabel(type.userId, currentUserId),
  },
];

export { createTypeColumns };
