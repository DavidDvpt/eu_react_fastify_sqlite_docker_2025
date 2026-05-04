import type {
  Control,
  FieldErrors,
  FieldValues,
  FormState,
  UseFormGetFieldState,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { useFormContext } from "react-hook-form";

function useSafeFormContext(): {
  control: Control<FieldValues>;
  errors: FieldErrors;
  formState: FormState<FieldValues>;
  getFieldState: UseFormGetFieldState<FieldValues>;
  register: UseFormRegister<FieldValues>;
  watch: UseFormWatch<FieldValues>;
} {
  const methods = useFormContext<FieldValues>();

  if (!methods) {
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
