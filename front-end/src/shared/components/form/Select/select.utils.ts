import type { SelectOption } from "@/shared/types";

export function SelectOptionHelper({ id, label }: SelectOption): SelectOption {
  return { id, label };
}
