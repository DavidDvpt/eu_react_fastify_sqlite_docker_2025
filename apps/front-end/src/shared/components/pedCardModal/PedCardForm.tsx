import { GenericForm } from "../form/Genericform";
import InputRHF from "../form/Input/InputRHF";
import { Button } from "@/components/ui/button";
import pedcardApi from "@/shared/services/pedCardApi";
import { pedcardFormSchema } from "@eu/zod-schemas";
import type { PedCardFormBody } from "@eu/types";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";

interface PedCardFormProps {
  initialized?: boolean;
  balance: number;
  submitLabel?: string;
  onSuccess?: () => void | Promise<void>;
}

function PedCardForm({
  initialized,
  balance,
  submitLabel,
  onSuccess,
}: PedCardFormProps) {
  const handleSubmit = async (data: PedCardFormBody) => {
    const currentBalance = balance;
    const isInitialBalance = initialized !== true;
    const value = isInitialBalance ? data.value : data.value - currentBalance;

    const ps = new pedcardApi();
    await ps.create({
      type: data.type,
      value,
    });

    InvalidateQueryAndKeys.invalidatePedcard();

    onSuccess?.();
  };

  return (
    <GenericForm
      schema={pedcardFormSchema}
      defaultValues={
        initialized
          ? { value: balance ?? 0, type: "ADJUSTMENT" }
          : { value: 0, type: "INITIAL_BALANCE" }
      }

      onSubmit={handleSubmit}
    >
      <div className="space-y-4 flex justify-center flex-col items-center">
        <div className="">
          <p className="m-0 mt-1 text-md text-center mb-[50px]">
            {`${initialized ? "Ajustement" : "Initialisation"} de la pedCard`}
          </p>
          {initialized && balance !== null && (
            <p>
              Solde actuel: <strong>{balance.toFixed(2)}</strong> Ped
            </p>
          )}
          <InputRHF
            name="value"
            selectOnFocus
            wrapperClassName="flex justify-center"
          />
        </div>

        <Button type="submit" variant="primary" className="mt-4 w-[50%]">
          {submitLabel ?? (initialized ? "Ajuster" : "Initialiser")}
        </Button>
      </div>
    </GenericForm>
  );
}

export default PedCardForm;
