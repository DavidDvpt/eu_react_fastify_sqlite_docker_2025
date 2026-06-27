import ModalGeneric from "@/shared/components/ModalGeneric";
import {
  TransactionBuyPanelContent,
  TransactionSellPanelContent,
} from "@/modules/transactions";
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
        <div className="gap-1 flex flex-col">
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
