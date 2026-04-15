import type { StockRow } from "@/modules/stock";
import type { GenericTableColumn } from "@/shared/components/GenericTable";
import { ImageService } from "@/shared/services/imageService";
import { FormatTools } from "@/shared/tools/formatTools";

const stockColumns: GenericTableColumn<StockRow>[] = [
  {
    key: "image",
    header: "Image",
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
    header: "Item",
    accessor: "name",
    cellClassName: "font-medium",
  },
  {
    key: "quantity",
    header: "Quantite",
    render: (item) => item.quantity,
  },
  {
    key: "totalPrice",
    header: "Prix total",
    render: (item) => `${FormatTools.pedFormat().format(item.totalPrice)} PED`,
    cellClassName: "text-right",
    headerClassName: "text-right",
  },
];

export { stockColumns };
