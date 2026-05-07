import type { SelectOption } from "@/shared/types";

export function SelectOptionHelper({ value, label }: SelectOption): SelectOption {
  return { value, label };
}
