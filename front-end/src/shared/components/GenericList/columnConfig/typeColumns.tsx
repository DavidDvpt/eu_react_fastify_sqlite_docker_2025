import type { GenericListColumn, Type } from "@/shared/types";

const typeColumns: GenericListColumn<Type>[] = [
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
    render: (type) => type.categoryName ?? type.categoryId,
  },
  {
    key: "scope",
    label: "Scope",
    width: "minmax(140px, 1fr)",
    render: (type) => (type.userId ? "Custom" : "Global"),
  },
];

export { typeColumns };
