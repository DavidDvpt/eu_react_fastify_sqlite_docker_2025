export interface SelectOption {
  value: string;
  label: string;
}

export interface AppSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  allOptionValue?: string;
  options: SelectOption[];
  hasAutocomplete?: boolean;
}
