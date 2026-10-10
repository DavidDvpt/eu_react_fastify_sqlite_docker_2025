import type { GenericListColumn } from "@/shared/types";
import type { StockRow } from "@/shared/helpers/stock";
import { formatItemNameWithTier, getItemStockValue } from "@/shared/helpers";
import { getItemImageUrl } from "@/shared/helpers/imageUrl";
import { FormatTools } from "@/shared/tools/formatTools";

const stockColumns = (
  useCardImageSize?: boolean,
): GenericListColumn<StockRow>[] => {
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
          ? (getItemImageUrl(value, "normal") ?? "")
          : "",
      imageAlt: (item) => item.name,
    },
    {
      key: "name",
      label: "Item",
      accessor: "name",
      fillRemainingSpace: true,
      minWidth: 280,
      bodyCellClassName: "text-text font-semibold pl-1",
      // Display-only tier suffix for tierable non-stackable instances
      // (e.g. "Sword T3"). Never persisted, never sent to the API.
      render: (item) =>
        formatItemNameWithTier({
          name: item.name,
          hasTierOption: item.type?.hasTierOption,
          isStackable: item.type?.isStackable,
          tierLevel: item.tierLevel,
        }),
    },
    {
      key: "quantity",
      label: "Quantite",
      minWidth: 120,
      maxWidth: 120,
      align: "right",
      bodyCellClassName:
        "text-right text-text-muted hover:text-text group-hover:text-text",
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
        `${FormatTools.pedFormat().format(getItemStockValue(item))} Peds`,
      bodyCellClassName:
        "text-right font-semibold text-text-muted hover:text-text group-hover:text-text",
      headerCellClassName: "text-right",
    },
  ];
};

export { stockColumns };
