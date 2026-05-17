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
    bodyCellClassName: "bg-white",
    headerCellClassName: "w-[40px]",
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
    accessor: "name",
    headerCellClassName: "text-left pl-2 flex-1",
    bodyCellClassName: "font-medium",
  },
  {
    key: "quantity",
    label: "Quantite",
    bodyCellClassName: "text-left pl-2 w-[10%]",
    headerCellClassName: "text-left pl-2 w-[10%]",
    render: (item) => item.quantity,
  },
  {
    key: "totalPrice",
    label: "Prix total",
    render: (item) => `${FormatTools.pedFormat().format(item.totalValue)} Peds`,
    bodyCellClassName: "text-right pr-2 w-[15%]",
    headerCellClassName: "text-right pr-2 w-[15%]",
  },
];

export { stockColumns };
