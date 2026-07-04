import { Button } from "@/components/ui/button";
import ModalGeneric from "@/shared/components/ModalGeneric";
import { Section } from "@/shared/components/Containers";
import { FormatTools } from "@/shared/tools";
import type { RunningTransaction } from "@/shared/types/transactions";

type RunningTransactionResellConfirmModalProps = {
  open: boolean;
  row: RunningTransaction | null;
  status: "SOLDED" | "RETURNED" | null;
  onCancel: () => void;
  onConfirm: () => void;
};

function RunningTransactionResellConfirmModal({
  open,
  row,
  status,
  onCancel,
  onConfirm,
}: RunningTransactionResellConfirmModalProps) {
  if (!open || !row || !status) {
    return null;
  }

  const title =
    status === "RETURNED" ? "Remise en vente" : "Nouvelle vente identique";
  const description =
    status === "RETURNED"
      ? "Cette vente a été retournée. Voulez-vous la remettre en vente ?"
      : "Cette vente a été soldée. Voulez-vous créer une nouvelle vente identique ?";
  const confirmLabel =
    status === "RETURNED" ? "Remettre en vente" : "Créer la vente";

  return (
    <ModalGeneric
      dialogType="form"
      variant="confirmation"
      noClose={false}
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onCancel();
      }}
      title={{ value: title, style: "m-0 text-2xl leading-tight" }}
      description={{ value: description, style: "text-sm text-muted-foreground" }}
    >
      <Section variant="modal" className="space-y-3 p-2">
        <div className="space-y-1 text-sm">
          <p className="m-0 font-semibold text-black">{row.itemName}</p>
          <p className="m-0 text-muted-foreground">
            Quantité: {row.quantity} · TTC:{" "}
            {FormatTools.pedFormat().format(row.ttc)} Ped
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="min-w-[110px] text-black"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="min-w-[110px]"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </Section>
    </ModalGeneric>
  );
}

export default RunningTransactionResellConfirmModal;
