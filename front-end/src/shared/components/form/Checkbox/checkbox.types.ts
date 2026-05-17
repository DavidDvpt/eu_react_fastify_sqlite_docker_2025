export type CheckboxProps = {
  name: string;
  value: boolean;
  label?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  onCheckedChange?: (checked: boolean) => void;
};
