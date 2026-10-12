import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import InputRHF from "@/shared/components/form/Input/InputRHF";
import type { RefiningFormValues } from "@/shared/schemas";

type RefiningQuantityFieldProps = {
  selectedResultId: string | null;
  linesPending: boolean;
  ppcm: number;
  maxClickCount: number;
};

function RefiningQuantityField({
  selectedResultId,
  linesPending,
  ppcm,
  maxClickCount,
}: RefiningQuantityFieldProps) {
  const { getValues, setValue } = useFormContext<RefiningFormValues>();

  useEffect(() => {
    if (selectedResultId && !linesPending) {
      const currentClickCount = getValues("clickCount");
      if (currentClickCount !== maxClickCount) {
        setValue("clickCount", maxClickCount, { shouldValidate: true });
      }
    }
  }, [getValues, linesPending, maxClickCount, selectedResultId, setValue]);

  return (
    <div className="flex flex-col gap-1.5">
      <InputRHF
        name="clickCount"
        label="Quantité (résultats)"
        type="number"
        min={maxClickCount > 0 ? ppcm : 0}
        max={maxClickCount}
        step={ppcm}
        registerOptions={{ valueAsNumber: true }}
      />
      <p className="m-0 text-xs text-text-muted">
        Multiple de {ppcm} — maximum {maxClickCount} résultat{maxClickCount > 1 ? "s" : ""}
      </p>
    </div>
  );
}

export default RefiningQuantityField;
