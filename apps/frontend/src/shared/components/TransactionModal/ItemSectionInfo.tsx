import { Section } from "@/shared/components/Containers";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import ItemAverageBuyMarkup from "@/shared/components/ItemAverageBuyMarkup/ItemAverageBuyMarkup";
import { getItemImageUrl } from "@/shared/helpers/imageUrl";
import useItemAverageBuyMarkup from "@/shared/hooks/rqFetchHooks/useItemAverageBuyMarkupData";
import { FormatTools } from "@/shared/tools/formatTools";
import type { ItemWithStock } from "@/shared/types";
import { useMemo } from "react";

interface ItemSectionInfoProps {
  itemWithStock: ItemWithStock;
}

function ItemSectionInfo({ itemWithStock }: ItemSectionInfoProps) {
  const { id, imageUrlId, name, value, stock } = itemWithStock;

  const { averageBuyMarkup } = useItemAverageBuyMarkup({ itemId: id });

  const itemImageUrl = useMemo(
    () => getItemImageUrl(imageUrlId, "normal"),
    [imageUrlId],
  );

  return (
    <Section variant="modal" className="flex flex-row items-center p-2">
      <ItemImage
        url={itemImageUrl}
        size="medium"
        classname="!h-20 !w-20 shrink-0"
        alt={`${name} image`}
      />

      <div className="ml-2 flex min-w-0 flex-1 flex-col gap-1">
        <p className="m-0 truncate text-base font-semibold">{name}</p>
        <p className="m-0 flex justify-between gap-2 text-xs">
          <span>
            Coût unitaire: {" "}
            <span className="text-text-muted">
              {FormatTools.pedFormat().format(value ?? 0)} Ped
            </span>
          </span>
          <span>
            Stock: {" "}
            <span className="text-text-muted">{stock || 0}</span>
          </span>
        </p>

        <ItemAverageBuyMarkup averageBuyMarkup={averageBuyMarkup} />
      </div>
    </Section>
  );
}

export default ItemSectionInfo;
