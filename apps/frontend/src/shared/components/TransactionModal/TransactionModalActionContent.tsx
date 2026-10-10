import ItemSectionInfo from "./ItemSectionInfo";
import TransactionPanelContent from "./TransactionPanelContent";
import type { TransactionModalParams } from "@/shared/types/transactions";
import useItemStock from "@/shared/hooks/rqFetchHooks/useItemStockData";
import useItemLotsData from "@/shared/hooks/rqFetchHooks/useItemLotsData";

interface TransactionModalActionContentProps {
  onClose: () => void;
  modalParams: TransactionModalParams;
}
function TransactionModalActionContent({
  onClose,
  modalParams,
}: TransactionModalActionContentProps) {
  const { itemId } = modalParams;

  const { itemWithStock } = useItemStock({ itemId });
  const { lots } = useItemLotsData({ itemId });

  if (!itemWithStock) return null;

  return (
    <div className="flex flex-col gap-1">
      <ItemSectionInfo itemWithStock={itemWithStock} />

      <TransactionPanelContent
        item={itemWithStock}
        onBack={onClose}
        modalParams={modalParams}
        lot={lots?.find((candidate) => candidate.id === modalParams.lotId) ?? null}
      />
    </div>
  );
}

export default TransactionModalActionContent;
