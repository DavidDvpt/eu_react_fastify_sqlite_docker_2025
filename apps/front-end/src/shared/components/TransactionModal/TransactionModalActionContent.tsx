import ItemSectionInfo from "./ItemSectionInfo";
import TransactionPanelContent from "./TransactionPanelContent";
import type { TransactionModalParams } from "@/shared/types/transactions";
import useItemStock from "@/shared/hooks/useItemStock";

interface TransactionModalActionContentProps {
  onClose: () => void;
  modalParams: TransactionModalParams;
}
function TransactionModalActionContent({
  onClose,
  modalParams,
}: TransactionModalActionContentProps) {
  const { itemId } = modalParams;
  console.log(modalParams);
  const { itemWithStock } = useItemStock({ itemId });
  console.log(itemWithStock);
  if (!itemWithStock) return null;

  return (
    <div className="flex flex-col gap-1">
      <ItemSectionInfo itemWithStock={itemWithStock} />

      <TransactionPanelContent
        item={itemWithStock}
        onBack={onClose}
        modalParams={modalParams}
      />
    </div>
  );
}

export default TransactionModalActionContent;
