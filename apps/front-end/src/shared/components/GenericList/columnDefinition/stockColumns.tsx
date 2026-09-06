import type { GenericListColumn, ItemWithStock } from "@/shared/types";
import { ImageService } from "@/shared/services/imageService";
import { FormatTools } from "@/shared/tools/formatTools";

const stockColumns = (
  useCardImageSize?: boolean,
): GenericListColumn<ItemWithStock>[] => {
  return [
    {
      key: "image",
      label: "Image",
      kind: "image",
      accessor: "imageUrlId",
      minWidth: 40,
      maxWidth: 40,
      bodyCellClassName: "bg-transparent",
      imageSize: useCardImageSize ? "medium" : "small",
      imageSrc: (value) =>
        typeof value === "string" && value.trim() !== ""
          ? (ImageService.getItemImageUrl(value, "normal") ?? "")
          : "",
      imageAlt: (item) => item.name,
    },
    {
      key: "name",
      label: "Item",
      accessor: "name",
      fillRemainingSpace: true,
      minWidth: 280,
      bodyCellClassName: "text-black font-semibold pl-1",
    },
    {
      key: "quantity",
      label: "Quantite",
      minWidth: 120,
      maxWidth: 120,
      align: "right",
      bodyCellClassName: "text-right",
      headerCellClassName: "text-right",
      render: (item) => item.stock,
    },
    {
      key: "totalPrice",
      label: "Prix total",
      minWidth: 160,
      maxWidth: 160,
      align: "right",
      render: (item) =>
        `${FormatTools.pedFormat().format(item.stock * item.value)} Peds`,
      bodyCellClassName: "text-right font-semibold",
      headerCellClassName: "text-right",
    },
  ];
};

export { stockColumns };
