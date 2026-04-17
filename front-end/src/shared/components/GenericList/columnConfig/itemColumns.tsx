import type { GenericListColumn, Item } from "@/types";
import {
  formatToFiveDecimals,
  getItemImageUrl,
} from "../../../../pages/manage/utils";

const itemColumns: GenericListColumn<Item>[] = [
  {
    key: "image",
    label: "Image",
    width: "32px",
    kind: "image",
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
    label: "Nom",
    width: "minmax(220px, 2fr)",
    render: (item) => item.name ?? "Unknown",
  },
  {
    key: "type",
    label: "Type",
    width: "minmax(160px, 1.4fr)",
    cellClassName: "",
    render: (item) => item.itemTypeName ?? item.itemTypeId,
  },
  {
    key: "value",
    label: "Valeur",
    width: "minmax(120px, 1fr)",
    align: "right",
    cellClassName: "",
    render: (item) => formatToFiveDecimals(item.value),
  },
  {
    key: "limited",
    label: "Limited",
    width: "minmax(110px, 1fr)",
    cellClassName: "",
    render: (item) => (item.isLimited ? "Oui" : "Non"),
  },
  {
    key: "stackable",
    label: "Stackable",
    width: "minmax(120px, 1fr)",
    cellClassName: "",
    render: (item) => (item.isStackable ? "Oui" : "Non"),
  },
  {
    key: "scope",
    label: "Scope",
    width: "minmax(120px, 1fr)",
    cellClassName: "",
    render: (item) => (item.userId ? "Custom" : "Global"),
  },
];

export { itemColumns };
