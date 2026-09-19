import { Button } from "@/components/ui/button";
import type { TransactionActionsProps } from "@/shared/types";

function TransactionActions({
  onBuy,
  onSell,
  onBack,
  direction = "row",
  className,
  buttonClassName,
  disableBuy = false,
  disableSell = false,
}: TransactionActionsProps) {
  const directionClass = direction === "column" ? "flex-col" : "flex-row";

  return (
    <div
      className={`flex ${directionClass} justify-end gap-2 ${className ?? ""}`}
    >
      <Button
        type="button"
        variant="primary"
        className={buttonClassName}
        onClick={onBuy}
        disabled={disableBuy}
      >
        Achat
      </Button>
      <Button
        type="button"
        variant="primary"
        className={buttonClassName}
        onClick={onSell}
        disabled={disableSell}
      >
        Vente
      </Button>
      <Button
        type="button"
        variant="secondary"
        className={buttonClassName}
        onClick={onBack}
      >
        Retour
      </Button>
    </div>
  );
}

export { TransactionActions };
