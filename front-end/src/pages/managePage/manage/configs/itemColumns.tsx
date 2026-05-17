import type { Item, GenericListColumn } from "@/shared/types";

import { getScopeLabel } from "./scopeLabel";
import { formatToFiveDecimals, getItemImageUrl } from "../utils";

const createItemColumns = (
  currentUserId?: string,
): GenericListColumn<Item>[] => [
  {
    key: "image",
    label: "Image",
    kind: "image",
    accessor: "imageUrlId",
    width: 40,
    bodyCellClassName: "bg-white",
    imageSrc: (value) => getItemImageUrl(String(value ?? "")) ?? "",
    imageAlt: (item) => item.name ?? "Image",
  },
  {
    key: "name",
    label: "Nom",
    kind: "text",
    accessor: "name",
    width: 320,
    bodyCellClassName: "text-black",
    value: (item) => item.name ?? "Unknown",
  },
  {
    key: "type",
    label: "Type",
    kind: "text",
    width: 220,
    bodyCellClassName: "text-black",
    value: (row) => ("typeName" in row ? row.typeName : "Unknown"),
  },
  {
    key: "value",
    label: "Valeur",
    kind: "number",
    accessor: "value",
    width: 140,
    align: "right",
    bodyCellClassName: "text-black",
    value: (row) => formatToFiveDecimals("value" in row ? row.value : 0),
  },
  {
    key: "limited",
    label: "Limited",
    kind: "text",
    accessor: "isLimited",
    width: 120,
    bodyCellClassName: "text-black",
    value: (row) =>
      "isLimited" in row ? (row.isLimited ? "Oui" : "Non") : "Non",
  },
  {
    key: "stackable",
    label: "Stackable",
    kind: "text",
    accessor: "isStackable",
    width: 140,
    bodyCellClassName: "text-black",
    value: (row) =>
      "isStackable" in row ? (row.isStackable ? "Oui" : "Non") : "Non",
  },
  {
    key: "scope",
    label: "Scope",
    kind: "text",
    accessor: "userId",
    width: 140,
    bodyCellClassName: "text-black",
    value: (row) =>
      "userId" in row ? getScopeLabel(row.userId, currentUserId) : "System",
  },
];

export { createItemColumns };
