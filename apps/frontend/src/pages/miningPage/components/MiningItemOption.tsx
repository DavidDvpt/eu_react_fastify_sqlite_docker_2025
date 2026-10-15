import { formatItemNameWithTier, getItemImageUrl } from "@/shared/helpers";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import type { ItemViewModel } from "@zod-schemas";

function MiningItemOption({
  item,
  tierLevel,
  quantity,
}: {
  item?: ItemViewModel;
  tierLevel?: number | null;
  quantity: number;
}) {
  const name = item
    ? formatItemNameWithTier({
        name: item.name,
        hasTierOption: item.type?.hasTierOption,
        isStackable: item.type?.isStackable,
        tierLevel,
      })
    : "Item indisponible";

  return (
    <span className="flex items-center gap-2">
      <ItemImage
        url={item ? getItemImageUrl(item.imageUrlId, "normal") : null}
        alt={name}
        size="small"
        classname="shrink-0"
      />
      <span className="min-w-0 truncate">{name}</span>
      <span className="ml-auto shrink-0 text-xs text-text-muted">×{quantity}</span>
    </span>
  );
}

export default MiningItemOption;
