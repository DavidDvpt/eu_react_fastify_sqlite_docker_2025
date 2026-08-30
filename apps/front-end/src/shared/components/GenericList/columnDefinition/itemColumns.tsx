import type { GenericListColumn } from "@/shared/types";
import { FormatTools } from "@/shared/tools";
import type { ItemDto } from "@eu/types";
import { ImageService } from "@/shared/services";

const createItemColumns = (): GenericListColumn<ItemDto>[] => [
  {
    key: "image",
    label: "Image",
    kind: "image",
    accessor: "imageUrlId",
    minWidth: 40,
    maxWidth: 40,
    bodyCellClassName: "bg-transparent",
    imageSrc: (value) =>
      typeof value === "string" && value.trim() !== ""
        ? (ImageService.getItemImageUrl(value, "micro") ?? "")
        : "",
    imageAlt: (item) => item.name ?? "Image",
  },
  {
    key: "name",
    label: "Nom",
    kind: "text",
    accessor: "name",
    fillRemainingSpace: true,
    bodyCellClassName: "text-black font-semibold pl-1",
  },
  {
    key: "type",
    label: "Type",
    kind: "text",
    minWidth: 120,
    maxWidth: 200,
    bodyCellClassName: "text-black",
    value: (row) => row.type?.name ?? "Unknown",
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
    minWidth: 60,
    maxWidth: 80,
    bodyCellClassName: "text-black",
    value: (row) => (row.type?.isStackable ? "Oui" : "Non"),
  },
  {
    key: "value",
    label: "Valeur",
    kind: "number",
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
