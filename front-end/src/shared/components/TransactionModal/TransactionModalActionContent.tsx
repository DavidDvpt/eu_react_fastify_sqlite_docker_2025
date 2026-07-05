import { ImageService } from "@/shared/services";
import useInventoryList from "@/pages/inventoryPage/inventory/useInventoryList";
import ItemSectionInfo from "./ItemSectionInfo";
import TransactionPanelContent from "./TransactionPanelContent";
import type { TransactionModalParams } from "@/shared/types/transactions";

interface TransactionModalActionContentProps {
  onClose: () => void;
  modalParams: TransactionModalParams;
}
function TransactionModalActionContent({
  onClose,
  modalParams,
}: TransactionModalActionContentProps) {
  const { itemId } = modalParams;
  const { getItemData } = useInventoryList();
  const itemInventory = getItemData(itemId);

  if (!itemInventory) return null;

  const itemImageUrl = itemInventory
    ? ImageService.getItemImageUrl(itemInventory.imageUrlId, "micro")
    : null;

  return (
    <div className="flex flex-col gap-1">
      <ItemSectionInfo
        itemImageUrl={itemImageUrl}
        itemInventory={itemInventory}
      />

      <TransactionPanelContent
        item={itemInventory}
        onBack={onClose}
        modalParams={modalParams}
      />
    </div>
  );
}

export default TransactionModalActionContent;
