import type { genericFilterSchema } from "@/shared/components/GenericFilter/genericFilterSchema";
import type { ItemDto } from "@eu/types";
import type z from "zod";

export type GenericFilterAvailability = {
  isPending: boolean;
  isError: boolean;
  count: number;
};

export type GenericFilterValues = z.infer<typeof genericFilterSchema>;

export interface DisplayedFields {
  category: boolean;
  type: boolean;
  item: boolean;
}

export type GenericFilterContext =
  "manageCategory" | "manageType" | "manageItem" | "inventory" | "transaction";
export interface GenericFilterProps {
  className?: string;
  selectedItem?: ItemDto | null;
  context?: GenericFilterContext;
  onSelectedItem?: (item: string) => void;
  onSelectedType?: (type: string) => void;
}

export type FilterKeys = keyof GenericFilterValues | "reset";
