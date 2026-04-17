import type { Item } from "@/pages/manage";
import type { GenericTableColumn } from "@/shared/components/GenericTable";
import { formatToFiveDecimals, getItemImageUrl } from "../../utils";

const itemColumns: GenericTableColumn<Item>[] = [
  {
    key: "image",
    header: "Image",
    cellClassName: "bg-table-image-bg border border-table-image-border",
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
    render: (item) => item.name ?? "Unknown",
  },
  {
    key: "type",
    header: "Type",
    cellClassName: "",
    render: (item) => item.itemTypeName ?? item.itemTypeId,
  },
  {
    key: "value",
    header: "Valeur",
    cellClassName: "",
    render: (item) => formatToFiveDecimals(item.value),
  },
  {
    key: "limited",
    header: "Limited",
    cellClassName: "",
    render: (item) => (item.isLimited ? "Oui" : "Non"),
  },
  {
    key: "stackable",
    header: "Stackable",
    cellClassName: "",
    render: (item) => (item.isStackable ? "Oui" : "Non"),
  },
  {
    key: "scope",
    header: "Scope",
    cellClassName: "",
    render: (item) => (item.userId ? "Custom" : "Global"),
  },
];

export { itemColumns };
