import { ModalGeneric } from "../ModalGeneric";
import TransactionResellContent from "./TransactionResellContent";
import TransactionModalActionContent from "./TransactionModalActionContent";

import useTransactionQueries from "@/shared/hooks/useTransactionQueries";
import PedCardForm from "../pedCardModal/PedCardForm";
import { useQueryClient } from "@tanstack/react-query";
import { usePedcardData } from "@/shared/hooks";

function TransactionModal() {
  const { queries, updateQueries } = useTransactionQueries();
  const { check, balance } = usePedcardData();
  const queryClient = useQueryClient();

  if (!queries?.action || !queries?.itemId) return null;

  const handleClose = () => updateQueries(null);

  const handlePedcardSucces = () => {
    queryClient.invalidateQueries({ queryKey: ["pedcard"] });
  };
  return (
    <ModalGeneric
      dialogType="form"
      noClose={false}
      open={true}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      title={{
        value: queries.action === "buy" ? "Achat" : "Vente",
        style: "m-0 text-2xl leading-tight",
      }}
    >
      {(queries.action === "resell" || queries.action === "newSell") && (
        <TransactionResellContent
          onClose={handleClose}
          action={queries.action}
          onResellValidate={() => updateQueries({ ...queries, action: "sell" })}
        />
      )}

      {(queries.action === "sell" || queries.action === "buy") &&
        (!check ? (
          <PedCardForm
            initialized={check}
            balance={balance}
            onSuccess={handlePedcardSucces}
          />
        ) : (
          <TransactionModalActionContent
            onClose={handleClose}
            modalParams={queries}
          />
        ))}
    </ModalGeneric>
  );
}

export default TransactionModal;
