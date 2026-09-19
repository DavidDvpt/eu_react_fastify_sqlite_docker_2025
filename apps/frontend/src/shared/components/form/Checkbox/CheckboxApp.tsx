import { cn } from "@/lib/utils";
import type { CheckboxProps } from "./checkbox.types";
import { Checkbox } from "@/components/ui/checkbox";
import { formLabelClassName } from "../form.styles";

function CheckboxApp({
  name,
  value,
  label,
  wrapperClassName,
  labelClassName,
  onCheckedChange,
}: CheckboxProps) {
  return (
    <div className={cn("flex items-center gap-2", wrapperClassName)}>
      <Checkbox id={name} checked={value} onCheckedChange={onCheckedChange} />

      {label ? (
        <label
          htmlFor={name}
          className={cn(formLabelClassName, labelClassName)}
        >
          {label}
        </label>
      ) : null}
    </div>
  );
}

export default CheckboxApp;
