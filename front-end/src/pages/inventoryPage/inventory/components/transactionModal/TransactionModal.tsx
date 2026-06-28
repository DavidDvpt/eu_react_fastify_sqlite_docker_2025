import ModalGeneric from "@/shared/components/ModalGeneric";
import { TransactionPanelContent } from "@/modules/transactions";
import { ImageService } from "@/shared/services";

import type { InventoryTransactionModalProps } from "../../stockTypes";

import ItemSectionInfo from "./ItemSectionInfo";

function TransactionModal({
  isOpen,
  action,
  transactionItem,
  onClose,
}: InventoryTransactionModalProps) {
  const modalAction = action === "buy" || action === "sell" ? action : null;

  if (!isOpen || !modalAction) return null;
  const itemImageUrl = transactionItem
    ? ImageService.getItemImageUrl(transactionItem.imageUrlId, "micro")
    : null;

  return (
    <ModalGeneric
      dialogType="form"
      noClose={false}
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={{
        value: modalAction === "buy" ? "Achat" : "Vente",
        style: "m-0 text-2xl leading-tight",
      }}
    >
      {transactionItem ? (
        <div className="flex flex-col gap-1">
          <ItemSectionInfo
            itemImageUrl={itemImageUrl}
            transactionItem={transactionItem}
          />

          <TransactionPanelContent
            item={transactionItem}
            onBack={onClose}
            action={modalAction}
          />
        </div>
      ) : null}
    </ModalGeneric>
  );
}

export default TransactionModal;
