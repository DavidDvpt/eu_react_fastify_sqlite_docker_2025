import type { GenericListColumn } from "@/shared/types";
import type { CategoryViewModel } from "@zod-schemas";

const createCategoryColumns = (): GenericListColumn<CategoryViewModel>[] => [
  {
    key: "name",
    label: "Nom",
    kind: "text",
    accessor: "name",
    fillRemainingSpace: true,
    minWidth: 240,
    bodyCellClassName: "text-text",
  },
];

export { createCategoryColumns };
