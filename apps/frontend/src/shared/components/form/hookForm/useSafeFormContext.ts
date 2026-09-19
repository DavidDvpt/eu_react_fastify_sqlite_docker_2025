import type { FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import type { SafeFormContext } from "../form.types";

function useSafeFormContext(options: {
  required: false;
}): SafeFormContext | null;
function useSafeFormContext(options?: { required?: true }): SafeFormContext;
function useSafeFormContext(options?: {
  required?: boolean;
}): SafeFormContext | null {
  const required = options?.required ?? true;
  const methods = useFormContext<FieldValues>();

  if (!methods) {
    if (!required) return null;

    throw new Error(
      "useSafeFormContext must be used inside a FormProvider (GenericForm).",
    );
  }

  const { control, formState, getFieldState, register, watch } = methods;

  return {
    control,
    register,
    errors: formState.errors,
    formState,
    getFieldState,
    watch,
  };
}

export default useSafeFormContext;
