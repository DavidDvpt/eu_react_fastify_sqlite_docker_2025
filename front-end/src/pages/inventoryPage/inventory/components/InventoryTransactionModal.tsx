import ModalGeneric from "@/shared/components/ModalGeneric";
import { TransactionPanelContent } from "@/modules/transactions";
import { ImageService } from "@/shared/services";
import { FormatTools } from "@/shared/tools";
import type { InventoryTransactionModalProps } from "../stockTypes";
import { Section } from "@/shared/components/Containers";

function InventoryTransactionModal({
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
          <Section variant="modal" className="flex flex-row items-center py-2">
            {itemImageUrl ? (
              <img
                src={itemImageUrl}
                alt={transactionItem.name}
                className="h-10 w-10 rounded object-contain"
              />
            ) : null}
            <div className="min-w-0">
              <p className="m-0 truncate font-semibold">
                {transactionItem.name}
              </p>
              <p className="m-0 text-sm">
                Coût unitaire:{" "}
                {FormatTools.pedFormat().format(transactionItem.unitPrice)} PED
                · Stock: {transactionItem.quantity}
              </p>
            </div>
          </Section>

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

export default InventoryTransactionModal;
