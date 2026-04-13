import { Link } from "react-router-dom";
import type { Item } from "@/modules/manage";
import type { GenericTableColumn } from "@/shared/components/GenericTable";
import { formatToFiveDecimals, getItemImageUrl } from "../../utils";

const itemColumns: GenericTableColumn<Item>[] = [
  {
    key: "image",
    header: "Image",
    cellClassName: "text-muted-foreground",
    render: (item) =>
      getItemImageUrl(item.imageUrlId) ? (
        <img
          src={getItemImageUrl(item.imageUrlId) ?? ""}
          alt={item.name}
          className="h-8 w-8 rounded object-contain"
          loading="lazy"
        />
      ) : (
        "-"
      ),
  },
  {
    key: "name",
    header: "Nom",
    render: (item) => (
      <Link
        to={`/manage/item/${item.id}/edit`}
        className="font-medium text-foreground no-underline"
      >
        {item.name}
      </Link>
    ),
  },
  {
    key: "type",
    header: "Type",
    cellClassName: "text-muted-foreground",
    render: (item) => item.itemTypeName ?? item.itemTypeId,
  },
  {
    key: "value",
    header: "Valeur",
    cellClassName: "text-muted-foreground",
    render: (item) => formatToFiveDecimals(item.value),
  },
  {
    key: "limited",
    header: "Limited",
    cellClassName: "text-muted-foreground",
    render: (item) => (item.isLimited ? "Oui" : "Non"),
  },
  {
    key: "stackable",
    header: "Stackable",
    cellClassName: "text-muted-foreground",
    render: (item) => (item.isStackable ? "Oui" : "Non"),
  },
  {
    key: "scope",
    header: "Scope",
    cellClassName: "text-muted-foreground",
    render: (item) => (item.userId ? "Custom" : "Global"),
  },
];

export { itemColumns };
