import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import CheckboxApp from "./CheckboxApp";

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

  const handleCheckedChange = (checked: boolean) => {
    const nextChecked = checked === true;
    form.setValue(name, nextChecked, {
      shouldDirty: true,
      shouldTouch: true,
    });
    onCheckedChange?.(nextChecked);
  };

  return (
    <CheckboxApp
      name={name}
      value={value}
      label={label}
      wrapperClassName={wrapperClassName}
      labelClassName={labelClassName}
      onCheckedChange={handleCheckedChange}
    />
  );
}

export default CheckboxRHF;
