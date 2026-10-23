import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import CheckboxApp from './CheckboxApp';

type CheckboxRHFProps = {
  name: string;
  label?: string;
  checkedValue?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  onCheckedChange?: (checked: boolean) => void;
};

function CheckboxRHF({
  name,
  label,
  checkedValue,
  wrapperClassName,
  labelClassName,
  onCheckedChange,
}: CheckboxRHFProps) {
  const form = useFormContext();
  useEffect(() => {
    form.register(name);
  }, [form, name]);
  const fieldValue = form.watch(name);
  const value = checkedValue
    ? Array.isArray(fieldValue) && fieldValue.includes(checkedValue)
    : Boolean(fieldValue);

  const handleCheckedChange = (checked: boolean) => {
    const nextChecked = checked === true;
    const nextValue = checkedValue
      ? (() => {
          const currentValues = Array.isArray(fieldValue) ? fieldValue : [];
          return nextChecked
            ? [...currentValues, checkedValue]
            : currentValues.filter((value) => value !== checkedValue);
        })()
      : nextChecked;

    form.setValue(name, nextValue, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    onCheckedChange?.(nextChecked);
  };

  return (
    <CheckboxApp
      name={checkedValue ? `${name}-${checkedValue}` : name}
      value={value}
      label={label}
      wrapperClassName={wrapperClassName}
      labelClassName={labelClassName}
      onCheckedChange={handleCheckedChange}
    />
  );
}

export default CheckboxRHF;
