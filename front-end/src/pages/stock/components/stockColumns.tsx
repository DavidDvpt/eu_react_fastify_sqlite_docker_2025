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
    width: "48px",
    cellClassName: "bg-table-image-bg border border-table-image-border",
    render: (item) => {
      const imageUrl = ImageService.getItemImageUrl(item.imageUrlId, "micro");
      if (!imageUrl) {
        return "-";
      }

      return (
        <img
          src={imageUrl}
          alt={item.name}
          className="h-8 w-8 rounded object-contain"
          loading="lazy"
        />
      );
    },
  },
  {
    key: "name",
    label: "Item",
    width: "minmax(240px, 2fr)",
    accessor: "name",
    cellClassName: "font-medium",
  },
  {
    key: "quantity",
    label: "Quantite",
    width: "minmax(80px, 1fr)",
    render: (item) => item.quantity,
  },
  {
    key: "totalPrice",
    label: "Prix total",
    width: "minmax(120px, 1fr)",
    align: "right",
    render: (item) => `${FormatTools.pedFormat().format(item.totalValue)} PED`,
    cellClassName: "text-right",
    headerClassName: "text-right",
  },
];

export { stockColumns };
