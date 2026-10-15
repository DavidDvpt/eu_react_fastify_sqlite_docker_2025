import { formatItemNameWithTier, getItemImageUrl } from "@/shared/helpers";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import type { ItemViewModel } from "@zod-schemas";
import type { ReactNode } from "react";

function MiningItemOption({
  item,
  tierLevel,
  quantity,
  rightContent,
}: {
  item?: ItemViewModel;
  tierLevel?: number | null;
  quantity: number;
  rightContent?: ReactNode;
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
      <span className="ml-auto flex shrink-0 items-center gap-2 text-xs text-text-muted">
        {rightContent}
        <span>×{quantity}</span>
      </span>
    </span>
  );
}

export default MiningItemOption;
