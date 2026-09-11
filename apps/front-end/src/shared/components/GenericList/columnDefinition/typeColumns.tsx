import type { GenericListColumn } from "@/shared/types";
import type { TypeDto } from "@eu/zod-schemas";

const createTypeColumns = (): GenericListColumn<TypeDto>[] => [
  {
    key: "name",
    label: "Nom",
    kind: "text",
    accessor: "name",
    fillRemainingSpace: true,
    minWidth: 320,
    bodyCellClassName: "text-text",
  },
  {
    key: "category",
    label: "Categorie",
    kind: "text",
    minWidth: 320,
    maxWidth: 320,
    bodyCellClassName: "text-text",
    value: (row) => row.category?.name ?? "unknown",
  },
];

export { createTypeColumns };
