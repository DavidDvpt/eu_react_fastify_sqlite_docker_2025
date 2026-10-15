import { useState } from "react";
import { Input } from "@/components/ui/input";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import { formatItemNameWithTier, getItemImageUrl, NumberHelper } from "@/shared/helpers";
import type { ItemViewModel } from "@zod-schemas";

type MiningResultCardProps = {
  item: ItemViewModel;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
};

function MiningResultCard({
  item,
  quantity,
  onQuantityChange,
}: MiningResultCardProps) {
  const [newQuantity, setNewQuantity] = useState("");
  const name = formatItemNameWithTier({
    name: item.name,
    hasTierOption: item.type?.hasTierOption,
    isStackable: item.type?.isStackable,
  });

  const handleQuantityChange = (value: string) => {
    setNewQuantity(value);
    const parsed = Number(value);
    if (value === "" || Number.isNaN(parsed)) return;
    onQuantityChange(Math.max(0, parsed));
  };

  return (
    <article className="grid w-[200px] min-w-0 grid-cols-[auto_1fr] gap-3 rounded-lg border border-border bg-surface p-2 text-xs">
      <ItemImage
        url={getItemImageUrl(item.imageUrlId, "normal")}
        alt={name}
        size="medium"
        classname="h-[70px] w-[70px] shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="line-clamp-2 break-words text-sm font-medium text-text">{name}</div>
        <div className="mt-1 text-text-muted">
          TT unitaire · {NumberHelper.formatNumber(item.value)}
        </div>
      </div>
      <div className="col-span-2 flex min-w-0 flex-col gap-1">
        <div className="flex justify-between gap-3 text-text-muted">
          <span>Quantité</span>
          <span className="text-text">{NumberHelper.formatNumber(quantity)}</span>
        </div>
        <Input
          type="number"
          min={0}
          value={newQuantity}
          placeholder="nouveau montant"
          className="font-sans !text-xs"
          onChange={(event) => handleQuantityChange(event.target.value)}
        />
      </div>
    </article>
  );
}

export default MiningResultCard;
