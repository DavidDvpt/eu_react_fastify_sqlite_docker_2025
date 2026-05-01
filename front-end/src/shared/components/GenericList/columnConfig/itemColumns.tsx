import type { GenericListColumn, ManageListRow } from "@/shared/types";
import {
  formatToFiveDecimals,
  getItemImageUrl,
} from "../../../../pages/manage/utils";

const itemColumns: GenericListColumn<ManageListRow>[] = [
  {
    key: "image",
    label: "Image",
    width: "32px",
    kind: "image",
    cellClassName: "bg-table-image-bg border border-table-image-border",
    render: (item) =>
      "imageUrlId" in item && getItemImageUrl(item.imageUrlId) ? (
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
    render: (row) => ("itemTypeName" in row ? row.itemTypeName : "Unknown"),
  },
  {
    key: "value",
    label: "Valeur",
    width: "minmax(120px, 1fr)",
    align: "right",
    cellClassName: "",
    render: (row) => formatToFiveDecimals("value" in row ? row.value : 0),
  },
  {
    key: "limited",
    label: "Limited",
    width: "minmax(110px, 1fr)",
    cellClassName: "",
    render: (row) =>
      "isLimited" in row ? (row.isLimited ? "Oui" : "Non") : "Non",
  },
  {
    key: "stackable",
    label: "Stackable",
    width: "minmax(120px, 1fr)",
    cellClassName: "",
    render: (row) =>
      "isStackable" in row ? (row.isStackable ? "Oui" : "Non") : "Non",
  },
  {
    key: "scope",
    label: "Scope",
    width: "minmax(120px, 1fr)",
    cellClassName: "",
    render: (row) =>
      "userId" in row ? (row.userId ? "Custom" : "Global") : "Global",
  },
];

export { itemColumns };
