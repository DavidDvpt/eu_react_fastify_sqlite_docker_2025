import type { Category } from "@/pages/manage";
import type { GenericTableColumn } from "@/shared/components/GenericTable";

const categoryColumns: GenericTableColumn<Category>[] = [
  {
    key: "name",
    header: "Nom",
    cellClassName: "text-table-body-text",
    render: (category) => category.name ?? "Unknow",
  },
  {
    key: "scope",
    header: "Scope",
    cellClassName: "text-table-body-text",
    render: (category) => (category.userId ? "Custom" : "Global"),
  },
];

export { categoryColumns };
