import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AppSelectProps } from "@/shared/types";

import { useState } from "react";

const AppSelect: React.FC<AppSelectProps> = ({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Item",
  allOptionValue = "__all__",
  options,
  hasAutocomplete,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredOptions = options.length
    ? options.filter((o) =>
        o.label!.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];
  return (
    <Select
      value={value ?? undefined}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="mt-2 bg-input-bg border border-input-border data-[placeholder]:[&>span]:text-input-placeholder data-[placeholder]:[&>span]:opacity-50">
        {hasAutocomplete ? (
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-none focus:ring-0 bg-transparent text-sm text-input-text placeholder:text-input-placeholder placeholder:opacity-50"
          />
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>
      <SelectContent className="bg-input-bg text-input-text max-h-[200px] overflow-auto">
        <SelectItem
          value={allOptionValue}
          className="data-[highlighted]:bg-select-item-hover data-[highlighted]:text-input-text"
        >
          Tous
        </SelectItem>
        {filteredOptions.map((o) => (
          <SelectItem
            key={o.id}
            value={o.id}
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
