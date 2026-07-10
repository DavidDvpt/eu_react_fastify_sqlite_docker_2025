import type { PedCardFormValues } from "@/shared/types/pedcard";
import { useQueryClient } from "@tanstack/react-query";
import { GenericForm } from "../form/Genericform";
import InputRHF from "../form/Input/InputRHF";
import { pedCardFormDefaultValues, pedCardFormSchema } from "./pedCardSchema";
import { Button } from "@/components/ui/button";
import { createPedCardEntry } from "@/lib/services";

interface PedCardFormProps {
  initialized?: boolean;
  balance: number | null;
  submitLabel?: string;
}

function PedCardForm({ initialized, balance, submitLabel }: PedCardFormProps) {
  const queryClient = useQueryClient();

  const handleSubmit = async (data: PedCardFormValues) => {
    const currentBalance = balance ?? 0;
    const isInitialBalance = initialized !== true;
    const value = isInitialBalance
      ? data.updatedValue
      : data.updatedValue - currentBalance;

    await createPedCardEntry({
      type: isInitialBalance ? "INITIAL_BALANCE" : "ADJUSTMENT",
      value,
    });

    await queryClient.invalidateQueries({ queryKey: ["pedCard"] });
  };

  return (
    <GenericForm
      schema={pedCardFormSchema}
      defaultValues={{
        updatedValue: initialized
          ? (balance ?? 0)
          : pedCardFormDefaultValues.updatedValue,
      }}
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
            name="updatedValue"
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
