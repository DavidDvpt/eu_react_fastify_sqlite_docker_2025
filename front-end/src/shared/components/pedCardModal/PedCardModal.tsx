import { ModalGeneric } from "../ModalGeneric";
import PedCardForm from "./PedCardForm";

interface PedCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: number | null;
  hasInitialBalance: boolean | null;
}

function PedCardModal({
  open,
  onOpenChange,
  balance,
  hasInitialBalance,
}: PedCardModalProps) {
  const handleSuccess = () => onOpenChange(false);

  return (
    <ModalGeneric
      dialogType="form"
      variant="default"
      open={open}
      onOpenChange={onOpenChange}
      noClose={false}
      title={{ value: "PedCard" }}
    >
      <PedCardForm
        initialized={hasInitialBalance === true}
        balance={balance}
        onSuccess={handleSuccess}
      />
    </ModalGeneric>
  );
}

export default PedCardModal;
