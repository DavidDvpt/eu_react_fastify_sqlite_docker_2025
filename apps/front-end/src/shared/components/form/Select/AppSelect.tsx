import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SelectOption } from "../form.types";
import { formControlClassName } from "../form.styles";

type AppSelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  options: SelectOption[];
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  muted?: boolean;
  error?: boolean;
};

function AppSelect({
  value,
  onValueChange,
  disabled = false,
  placeholder,
  options,
  triggerClassName,
  contentClassName,
  itemClassName,
  muted = false,
  error = false,
}: AppSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          formControlClassName,
          "px-3 py-2 data-[placeholder]:[&>span]:text-input-placeholder data-[placeholder]:[&>span]:opacity-50",
          muted && "text-text-muted",
          error && "border-error-500 focus-visible:ring-error-500",
          triggerClassName,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className={cn(
          "max-h-[200px] min-w-[100px] overflow-auto bg-surface text-text",
          contentClassName,
        )}
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={cn(
              "data-[highlighted]:bg-select-item-hover data-[highlighted]:text-text",
              itemClassName,
            )}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default AppSelect;
