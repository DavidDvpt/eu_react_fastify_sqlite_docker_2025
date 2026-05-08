import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

type CheckboxRHFProps = {
  name: string;
  label?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  onCheckedChange?: (checked: boolean) => void;
};

function CheckboxRHF({
  name,
  label,
  wrapperClassName,
  labelClassName,
  onCheckedChange,
}: CheckboxRHFProps) {
  const form = useFormContext();
  useEffect(() => {
    form.register(name);
  }, [form, name]);
  const value = Boolean(form.watch(name));

  return (
    <div className={cn("flex items-center gap-2", wrapperClassName)}>
      <Checkbox
        id={name}
        checked={value}
        onCheckedChange={(checked) => {
          const nextChecked = checked === true;
          form.setValue(name, nextChecked, { shouldDirty: true, shouldTouch: true });
          onCheckedChange?.(nextChecked);
        }}
      />
      {label ? (
        <label htmlFor={name} className={cn("text-sm text-input-label", labelClassName)}>
          {label}
        </label>
      ) : null}
    </div>
  );
}

export default CheckboxRHF;
