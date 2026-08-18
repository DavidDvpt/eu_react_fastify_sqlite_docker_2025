import { ImageService } from "@/shared/services";
import { FormatTools } from "@/shared/tools/formatTools";
import type { ItemDto } from "@eu/types";

interface ItemCardProps {
  item: ItemDto;
  isManage: boolean;
}
function ItemCard({ item, isManage }: ItemCardProps) {
  return (
    <article className="flex items-start gap-3">
      <div className="h-[100px] w-[100px] shrink-0">
        {ImageService.getItemImageUrl(item.imageUrlId) ? (
          <img
            src={ImageService.getItemImageUrl(item.imageUrlId) ?? ""}
            alt={item.name}
            className="h-full w-full rounded object-contain"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-table-head-text mt-0 mb-1">
          {item.name ?? "Unknown"}
        </h3>
        <p className="truncate text-xs text-muted-foreground my-0">
          {item.type?.name ?? item.typeId}
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-table-body-text">
          <span>Valeur: {FormatTools.formatToThreeDecimals(item.value)}</span>
          <span>Limited: {item.isLimited ? "Oui" : "Non"}</span>
          <span>Stackable: {item.type?.isStackable ? "Oui" : "Non"}</span>
          {isManage && <span>Scope: {item.userId ? "Custom" : "Global"}</span>}
        </div>
      </div>
    </article>
  );
}

export default ItemCard;
