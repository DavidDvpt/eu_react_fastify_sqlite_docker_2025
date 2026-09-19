import type { SelectOption } from "../form.types";

export function SelectOptionHelper({ value, label }: SelectOption): SelectOption {
  return { value, label };
}
