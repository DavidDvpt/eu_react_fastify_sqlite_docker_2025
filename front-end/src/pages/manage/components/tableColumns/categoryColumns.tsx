import { Link } from "react-router-dom";
import type { Category } from "@/modules/manage";
import type { GenericTableColumn } from "@/shared/components/GenericTable";

const categoryColumns: GenericTableColumn<Category>[] = [
  {
    key: "name",
    header: "Nom",
    render: (category) => (
      <Link
        to={`/manage/category/${category.id}/edit`}
        className="font-medium text-foreground no-underline"
      >
        {category.name}
      </Link>
    ),
  },
  {
    key: "scope",
    header: "Scope",
    cellClassName: "text-muted-foreground",
    render: (category) => (category.userId ? "Custom" : "Global"),
  },
];

export { categoryColumns };
