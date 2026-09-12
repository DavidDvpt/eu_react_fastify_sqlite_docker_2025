import type { RowRendererProps } from "@/shared/components/GenericList/genericListTypes";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import { ImageService } from "@/shared/services";
import { FormatTools } from "@/shared/tools";
import type { ItemWithStock } from "@/shared/types";

function InventoryItemCard({ row, onRowClick }: RowRendererProps<ItemWithStock>) {
  return (
    <article
      className={`flex items-start gap-3 rounded-md border border-table-border p-3 ${
        onRowClick ? "cursor-pointer" : ""
      }`}
      onClick={onRowClick ? () => onRowClick(row) : undefined}
    >
      <div className="h-[100px] w-[100px] shrink-0">
        <ItemImage
          url={ImageService.getItemImageUrl(row.imageUrlId, "normal")}
          alt={row.name}
          size="medium"
          classname="h-full w-full"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="m-0 truncate text-sm font-semibold text-table-head-text">
          {row.name}
        </h3>
        {row.weight !== null && (
          <p className="m-0 text-xs text-muted-foreground">
            Poids: {FormatTools.formatToThreeDecimals(row.weight)}
          </p>
        )}
        {row.description && (
          <p className="m-0 line-clamp-2 text-xs text-muted-foreground">
            {row.description}
          </p>
        )}
        <div className="mt-auto flex flex-col gap-1 pt-2 text-xs text-table-body-text">
          <span>Quantité: {row.stock}</span>
          <span>
            Valeur: {FormatTools.pedFormat().format(row.stock * row.value)} Peds
          </span>
        </div>
      </div>
    </article>
  );
}

export default InventoryItemCard;
