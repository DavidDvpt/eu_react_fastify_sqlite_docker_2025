import type { GenericListColumn } from "@/shared/types";
import type { CategoryDto } from "@eu/types";

const createCategoryColumns = (): GenericListColumn<CategoryDto>[] => [
  {
    key: "name",
    label: "Nom",
    kind: "text",
    accessor: "name",
    fillRemainingSpace: true,
    minWidth: 240,
    bodyCellClassName: "text-black",
  },
];

export { createCategoryColumns };
