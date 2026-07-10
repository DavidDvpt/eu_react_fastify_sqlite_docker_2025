import { Button } from "@/components/ui/button";
import type { TransactionAction } from "@/shared/types";

interface TransactionResellContentProps {
  onResellValidate: () => void;
  action: TransactionAction;
}

function TransactionResellContent({
  action,
  onResellValidate,
}: TransactionResellContentProps) {
  return (
    <div className="flex h-full min-h-[200px] w-full flex-col justify-between">
      <p className="text-center text-md mt-[30px]">
        {action === "resell"
          ? "Voulez vous remettre cet item en vente ?"
          : "Voulez vous créer une nouvelle vente pour cet item ?"}
      </p>

      <div className="flex justify-center gap-4 w-full ">
        <Button
          variant="secondary"
          onClick={onResellValidate}
          className="w-[30%]"
        >
          Non
        </Button>
        <Button
          variant="primary"
          onClick={onResellValidate}
          className="w-[30%]"
        >
          Oui
        </Button>
      </div>
    </div>
  );
}

export default TransactionResellContent;
