import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AppSelectProps } from "@/shared/types";

const AppSelect: React.FC<AppSelectProps> = ({
  value,
  onValueChange,
  disabled = false,
  placeholder = "default placeholder",
  options,
}) => {
  const currentValue = value ?? undefined;

  return (
    <Select
      value={currentValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="mt-2 bg-input-bg border border-input-border data-[placeholder]:[&>span]:text-input-placeholder data-[placeholder]:[&>span]:opacity-50">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-input-bg text-input-text max-h-[200px] overflow-auto">
        {options.map((o) => (
          <SelectItem
            key={o.label}
            value={o.value}
            className="data-[highlighted]:bg-select-item-hover data-[highlighted]:text-input-text"
          >
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AppSelect;
