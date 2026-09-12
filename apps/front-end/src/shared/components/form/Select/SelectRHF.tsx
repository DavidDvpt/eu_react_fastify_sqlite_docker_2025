import { cn } from "@/lib/utils";
import useSafeFormContext from "@/shared/components/form/hookForm/useSafeFormContext";
import { Controller } from "react-hook-form";
import type { SelectRHFProps } from "../form.types";
import AppSelect from "./AppSelect";

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
  errorClassName,
  hideErrorMessage = false,
}) => {
  const rhf = useSafeFormContext({ required: false });

  const renderSelect = (
    currentValue: string | undefined,
    onChange: (nextValue: string) => void,
  ) => (
    <AppSelect
      value={currentValue}
      onValueChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      options={options}
      triggerClassName={triggerClassName}
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
      <div className={cn("space-y-1", wrapperClassName)}>
        {label ? (
          <label className="text-sm text-input-label">{label}</label>
        ) : null}
        <Controller
          name={name}
          control={rhf.control}
          render={({ field }) =>
            renderSelect(
              typeof field.value === "string" ? field.value : undefined,
              field.onChange,
            )
          }
        />
        {!hideErrorMessage && fieldState.error?.message ? (
          <p
            className={cn(
              "m-0 text-[0.8rem] italic text-destructive-300",
              errorClassName,
            )}
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
