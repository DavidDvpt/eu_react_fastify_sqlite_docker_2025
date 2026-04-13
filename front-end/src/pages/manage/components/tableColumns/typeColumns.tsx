import { Link } from "react-router-dom";
import type { Type } from "@/modules/manage";
import type { GenericTableColumn } from "@/shared/components/GenericTable";

const typeColumns: GenericTableColumn<Type>[] = [
  {
    key: "name",
    header: "Nom",
    render: (type) => (
      <Link
        to={`/manage/type/${type.id}/edit`}
        className="font-medium text-foreground no-underline"
      >
        {type.name}
      </Link>
    ),
  },
  {
    key: "category",
    header: "Categorie",
    cellClassName: "text-muted-foreground",
    render: (type) => type.categoryName ?? type.categoryId,
  },
  {
    key: "scope",
    header: "Scope",
    cellClassName: "text-muted-foreground",
    render: (type) => (type.userId ? "Custom" : "Global"),
  },
];

export { typeColumns };
