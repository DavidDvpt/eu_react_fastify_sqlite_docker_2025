import type { ItemInventory } from "@/pages/inventoryPage/inventory/stockTypes";
import { Section } from "@/shared/components/Containers";
import { FormatTools } from "@/shared/tools/formatTools";

interface ItemSectionInfoProps {
  itemImageUrl: string | null;
  itemInventory: ItemInventory | null;
}

function ItemSectionInfo({
  itemImageUrl,
  itemInventory,
}: ItemSectionInfoProps) {
  return (
    <Section variant="modal" className="flex flex-row items-center py-2">
      {itemImageUrl ? (
        <img
          src={itemImageUrl}
          alt={itemInventory?.name}
          className="h-10 w-10 rounded object-contain"
        />
      ) : null}
      <div className="min-w-0">
        <p className="m-0 truncate font-semibold">{itemInventory?.name}</p>
        <p className="m-0 text-sm">
          Coût unitaire:{" "}
          {FormatTools.pedFormat().format(itemInventory?.value ?? 0)} Ped ·
          Stock: {itemInventory?.quantity || 0}
        </p>
      </div>
    </Section>
  );
}

export default ItemSectionInfo;
