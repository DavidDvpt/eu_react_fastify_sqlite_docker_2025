import { useFormContext } from "react-hook-form";

import type { RefiningFormValues } from "@/shared/schemas";
import RefiningRecipeList from "./RefiningRecipeList";
import type { RefiningRecipeOptionData } from "./refiningTypes";

type RefiningRecipeFieldProps = {
  options: RefiningRecipeOptionData[];
  isPending: boolean;
  isLinesPending: boolean;
  hasError: boolean;
  selectedResultId: string | null;
  onSelect: (id: string) => void;
};

function RefiningRecipeField({
  options,
  isPending,
  isLinesPending,
  hasError,
  selectedResultId,
  onSelect,
}: RefiningRecipeFieldProps) {
  const { setValue } = useFormContext<RefiningFormValues>();

  return (
    <RefiningRecipeList
      options={options}
      isPending={isPending}
      isLinesPending={isLinesPending}
      hasError={hasError}
      selectedResultId={selectedResultId}
      onSelect={(id) => {
        onSelect(id);
        setValue("result", id, { shouldValidate: true });
        const option = options.find((candidate) => candidate.resultId === id);
        if (option) setValue("clickCount", option.maxClickCount, { shouldValidate: true });
      }}
    />
  );
}

export default RefiningRecipeField;
