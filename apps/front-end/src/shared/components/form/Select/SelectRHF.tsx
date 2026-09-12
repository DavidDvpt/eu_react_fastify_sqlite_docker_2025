import { cn } from "@/lib/utils";
import useSafeFormContext from "@/shared/components/form/hookForm/useSafeFormContext";
import { Controller } from "react-hook-form";
import type { SelectRHFProps } from "../form.types";
import AppSelect from "./AppSelect";
import {
  formErrorClassName,
  formFieldWrapperClassName,
  formLabelClassName,
} from "../form.styles";

const SelectRHF: React.FC<SelectRHFProps> = ({
  name,
  label,
  value,
  onValueChange,
  disabled = false,
  placeholder = "default placeholder",
  options,
  wrapperClassName,
  triggerClassName,
  labelClassName,
  errorClassName,
  hideErrorMessage = false,
}) => {
  const rhf = useSafeFormContext({ required: false });

  const renderSelect = (
    currentValue: string | undefined,
    onChange: (nextValue: string) => void,
    error = false,
  ) => (
    <AppSelect
      value={currentValue}
      onValueChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      options={options}
      triggerClassName={cn(triggerClassName, label && "mt-1")}
      error={error}
    />
  );

  if (name) {
    if (!rhf) {
      throw new Error(
        "SelectRHF with a `name` must be used inside a FormProvider (GenericForm).",
      );
    }

    const fieldState = rhf.getFieldState(name, rhf.formState);

    return (
      <div className={cn(formFieldWrapperClassName, wrapperClassName)}>
        {label ? (
          <label className={cn(formLabelClassName, labelClassName)}>
            {label}
          </label>
        ) : null}
        <Controller
          name={name}
          control={rhf.control}
          render={({ field }) =>
            renderSelect(
              typeof field.value === "string" ? field.value : undefined,
              field.onChange,
              Boolean(fieldState.error),
            )
          }
        />
        {!hideErrorMessage && fieldState.error?.message ? (
          <p
            className={cn(formErrorClassName, errorClassName)}
          >
            {String(fieldState.error.message)}
          </p>
        ) : null}
      </div>
    );
  }

  return renderSelect(value ?? undefined, (nextValue) =>
    onValueChange?.(nextValue),
  );
};

export default SelectRHF;
