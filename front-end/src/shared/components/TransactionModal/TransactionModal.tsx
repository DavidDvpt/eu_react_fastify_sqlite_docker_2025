import ModalGeneric from "@/shared/components/ModalGeneric";
import { ImageService } from "@/shared/services";
import type { TransactionModalProps } from "@/shared/types/transactions";

import ItemSectionInfo from "./ItemSectionInfo";
import TransactionPanelContent from "./TransactionPanelContent";

function transactionModal({
  isOpen,
  action,
  transactionItem,
  onClose,
  defaultValues,
}: TransactionModalProps) {
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
            defaultValues={defaultValues}
          />
        </div>
      ) : null}
    </ModalGeneric>
  );
}

export default transactionModal;
