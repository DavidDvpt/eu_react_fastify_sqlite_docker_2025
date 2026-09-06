import { Section } from "@/shared/components/Containers";
import ItemImage from "@/shared/components/itemImage/ItemImage";
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
    () => ImageService.getItemImageUrl(imageUrlId, "normal"),
    [imageUrlId],
  );

  return (
    <Section variant="modal" className="flex flex-row items-center p-2">
      <ItemImage url={itemImageUrl} size="small" alt={`${name} image`} />

      <div className="min-w-0 ml-2">
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
