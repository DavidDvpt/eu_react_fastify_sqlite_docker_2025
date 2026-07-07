import { ModalGeneric } from "../ModalGeneric";
import TransactionResellContent from "./TransactionResellContent";
import TransactionModalActionContent from "./TransactionModalActionContent";
import { usePedCard } from "@/shared/hooks";
import useTransactionQueries from "@/shared/hooks/useTransactionQueries";

function TransactionModal() {
  const { queries, updateQueries } = useTransactionQueries();
  const { pedCard } = usePedCard();

  if (!queries?.action || !queries?.itemId) return null;

  const handleClose = () => updateQueries(null);
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
          onResellValidate={() => updateQueries({ ...queries, action: "sell" })}
        />
      )}

      {(queries.action === "sell" || queries.action === "buy") &&
        (pedCard?.hasInitialBalance ? (
          <div></div>
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
