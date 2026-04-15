import type { Type } from "@/modules/manage";
import type { GenericTableColumn } from "@/shared/components/GenericTable";

const typeColumns: GenericTableColumn<Type>[] = [
  {
    key: "name",
    header: "Nom",
    render: (type) => type.name ?? "Unknown",
  },
  {
    key: "category",
    header: "Categorie",
    render: (type) => type.categoryName ?? type.categoryId,
  },
  {
    key: "scope",
    header: "Scope",
    render: (type) => (type.userId ? "Custom" : "Global"),
  },
];

export { typeColumns };
