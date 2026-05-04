import ModalGeneric from "@/shared/components/ModalGeneric";
import {
  TransactionBuyPanelContent,
  TransactionSellPanelContent,
} from "@/modules/transactions";
import { ImageService } from "@/shared/services";
import { FormatTools } from "@/shared/tools";
import type { InventoryTransactionModalProps } from "../stockTypes";

function InventoryTransactionModal({
  isOpen,
  action,
  transactionItem,
  onClose,
}: InventoryTransactionModalProps) {
  if (!isOpen) return null;
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
        value: action === "buy" ? "Achat" : "Vente",
        style: "m-0 text-2xl leading-tight",
      }}
    >
      {transactionItem ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-section-modal-border bg-section-modal-bg px-3 py-2">
            {itemImageUrl ? (
              <img
                src={itemImageUrl}
                alt={transactionItem.name}
                className="h-10 w-10 rounded object-contain"
              />
            ) : null}
            <div className="min-w-0">
              <p className="m-0 truncate font-semibold text-[var(--color-modal-text)]">
                {transactionItem.name}
              </p>
              <p className="m-0 text-sm text-[var(--color-modal-text)]/80">
                Coût unitaire:{" "}
                {FormatTools.pedFormat().format(transactionItem.unitPrice)} PED
                · Stock: {transactionItem.quantity}
              </p>
            </div>
          </div>

          {action === "buy" ? (
            <TransactionBuyPanelContent
              item={transactionItem}
              onBack={onClose}
            />
          ) : (
            <TransactionSellPanelContent
              item={transactionItem}
              onBack={onClose}
            />
          )}
        </div>
      ) : null}
    </ModalGeneric>
  );
}

export default InventoryTransactionModal;
