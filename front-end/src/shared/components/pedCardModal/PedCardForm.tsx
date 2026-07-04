import type { PedCardFormValues } from "@/shared/types/pedcard";
import { GenericForm } from "../form/Genericform";
import InputRHF from "../form/Input/InputRHF";
import { pedCardFormDefaultValues, pedCardFormSchema } from "./pedCardSchema";
import { Button } from "@/components/ui/button";

interface PedCardFormProps {
  initialized: boolean;
  balance: number | null;
  onSubmit?: (data: PedCardFormValues) => void | Promise<void>;
  submitLabel?: string;
}

function PedCardForm({
  initialized,
  balance,
  onSubmit,
  submitLabel,
}: PedCardFormProps) {
  const handleSubmit = (data: PedCardFormValues) => {
    if (onSubmit) {
      return onSubmit(data);
    }

    console.log("Form submitted with data:", data);
  };

  return (
    <GenericForm
      schema={pedCardFormSchema}
      defaultValues={{
        updatedValue: initialized ? balance ?? 0 : pedCardFormDefaultValues.updatedValue,
      }}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <p className="m-0 mt-1 text-md ">
            {`${initialized ? "Ajustement" : "Initialisation"} de la pedCard`}
          </p>
          {initialized && balance !== null && (
            <p>
              Solde actuel: <strong>{balance.toFixed(2)}</strong> Ped
            </p>
          )}
          <InputRHF name="updatedValue" />
        </div>

        <Button type="submit" variant="primary" className="mt-4 w-full">
          {submitLabel ?? (initialized ? "Ajuster" : "Initialiser")}
        </Button>
      </div>
    </GenericForm>
  );
}

export default PedCardForm;
