import type { GenericListColumn } from "@/shared/types";
import { ImageService } from "@/shared/services/imageService";
import { FormatTools } from "@/shared/tools/formatTools";
import type { ItemInventory } from "../stockTypes";

const stockColumns: GenericListColumn<
  Pick<ItemInventory, "imageUrlId" | "name" | "quantity" | "totalValue">
>[] = [
  {
    key: "image",
    label: "Image",
    kind: "image",
    accessor: "imageUrlId",
    minWidth: 40,
    maxWidth: 40,
    bodyCellClassName: "bg-white",
    imageSrc: (value) =>
      typeof value === "string" && value.trim() !== ""
        ? ImageService.getItemImageUrl(value, "micro") ?? ""
        : "",
    imageAlt: (item) => item.name,
  },
  {
    key: "name",
    label: "Item",
    accessor: "name",
    fillRemainingSpace: true,
    minWidth: 280,
    bodyCellClassName: "font-medium",
  },
  {
    key: "quantity",
    label: "Quantite",
    minWidth: 120,
    maxWidth: 120,
    bodyCellClassName: "text-left",
    headerCellClassName: "text-left",
    render: (item) => item.quantity,
  },
  {
    key: "totalPrice",
    label: "Prix total",
    minWidth: 160,
    maxWidth: 160,
    render: (item) => `${FormatTools.pedFormat().format(item.totalValue)} Peds`,
    bodyCellClassName: "text-right",
    headerCellClassName: "text-right",
  },
];

export { stockColumns };
