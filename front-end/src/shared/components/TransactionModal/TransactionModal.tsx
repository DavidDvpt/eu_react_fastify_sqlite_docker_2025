import { ModalGeneric } from "../ModalGeneric";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import TransactionResellContent from "./TransactionResellContent";
import TransactionModalActionContent from "./TransactionModalActionContent";
import type { TransactionAction, TransactionModalParams } from "@/shared/types";
import { usePedCard } from "@/shared/hooks";

interface TransactionModalProps {
  onClose: () => void;
}
function TransactionModal({ onClose }: TransactionModalProps) {
  const { itemId, action, quantity, ttc } = useParams();
  const { pedCard } = usePedCard();

  const params: TransactionModalParams = useMemo(() => {
    return {
      action: action as TransactionAction,
      itemId: itemId || "",
      quantity: Number(quantity) || 1,
      ttc: Number(ttc) || 0,
    };
  }, [itemId, action, quantity, ttc]);

  if (!params.action || !params.itemId) return null;

  const handleReselValidate = () => {
    onClose();
  };

  return (
    <ModalGeneric
      dialogType="form"
      noClose={false}
      open={action && itemId ? true : false}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={{
        value: params.action === "buy" ? "Achat" : "Vente",
        style: "m-0 text-2xl leading-tight",
      }}
    >
      {(action === "resell" || action === "newSell") && (
        <TransactionResellContent onResellValidate={handleReselValidate} />
      )}

      {(params.action === "sell" || params.action === "buy") &&
        (pedCard?.hasInitialBalance ? (
          <div></div>
        ) : (
          <TransactionModalActionContent
            onClose={onClose}
            modalParams={params}
          />
        ))}
    </ModalGeneric>
  );
}

export default TransactionModal;
