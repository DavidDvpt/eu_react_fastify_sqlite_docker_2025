import { getScopeLabel } from "@/shared/components/GenericList/columnDefinition/scopeLabel";
import { getItemImageUrl } from "@/pages/managePage/utils";
import type { Item, GenericListColumn } from "@/shared/types";
import { FormatTools } from "@/shared/tools";

const createItemColumns = (
  currentUserId?: string,
): GenericListColumn<Item>[] => [
  {
    key: "image",
    label: "Image",
    kind: "image",
    accessor: "imageUrlId",
    minWidth: 40,
    maxWidth: 40,
    bodyCellClassName: "bg-white",
    imageSrc: (value) => getItemImageUrl(String(value ?? "")) ?? "",
    imageAlt: (item) => item.name ?? "Image",
  },
  {
    key: "name",
    label: "Nom",
    kind: "text",
    accessor: "name",
    fillRemainingSpace: true,
    bodyCellClassName: "text-black font-semibold",
    value: (item) => item.name ?? "Unknown",
  },
  {
    key: "type",
    label: "Type",
    kind: "text",
    minWidth: 120,
    maxWidth: 200,
    bodyCellClassName: "text-black",
    value: (row) => ("typeName" in row ? row.typeName : "Unknown"),
  },

  {
    key: "limited",
    label: "Limited",
    kind: "text",
    accessor: "isLimited",
    minWidth: 60,
    maxWidth: 80,
    bodyCellClassName: "text-black",
    value: (row) =>
      "isLimited" in row ? (row.isLimited ? "Oui" : "Non") : "Non",
  },
  {
    key: "stackable",
    label: "Stackable",
    kind: "text",
    accessor: "isStackable",
    minWidth: 60,
    maxWidth: 80,
    bodyCellClassName: "text-black",
    value: (row) =>
      "isStackable" in row ? (row.isStackable ? "Oui" : "Non") : "Non",
  },
  {
    key: "scope",
    label: "Scope",
    kind: "text",
    accessor: "userId",
    minWidth: 60,
    maxWidth: 80,
    bodyCellClassName: "text-black",
    value: (row) =>
      "userId" in row ? getScopeLabel(row.userId, currentUserId) : "System",
  },
  {
    key: "value",
    label: "Valeur",
    kind: "number",
    accessor: "value",
    minWidth: 80,
    maxWidth: 100,
    align: "right",
    bodyCellClassName: "text-black font-semibold",
    value: (row) =>
      FormatTools.trimTrailingZeros(
        FormatTools.formatToDecimals("value" in row ? row.value : 0, 5),
        2,
      ),
  },
];

export { createItemColumns };
