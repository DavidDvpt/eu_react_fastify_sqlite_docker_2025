import { Section } from "@/shared/components/Containers";
import { ImageService } from "@/shared/services";
import { FormatTools } from "@/shared/tools/formatTools";
import type { ItemWithStock } from "@/shared/types";
import { useMemo } from "react";

interface ItemSectionInfoProps {
  itemWithStock: ItemWithStock;
}

function ItemSectionInfo({ itemWithStock }: ItemSectionInfoProps) {
  const { imageUrlId, name, value, stock } = itemWithStock;

  const itemImageUrl = useMemo(
    () => ImageService.getItemImageUrl(imageUrlId, "micro"),
    [imageUrlId],
  );

  return (
    <Section variant="modal" className="flex flex-row items-center py-2">
      {itemImageUrl ? (
        <img
          src={itemImageUrl}
          alt={name}
          className="h-10 w-10 rounded object-contain"
        />
      ) : null}
      <div className="min-w-0">
        <p className="m-0 truncate font-semibold">{name}</p>
        <p className="m-0 text-sm">
          Coût unitaire: {FormatTools.pedFormat().format(value ?? 0)} Ped ·
          Stock: {stock || 0}
        </p>
      </div>
    </Section>
  );
}

export default ItemSectionInfo;
