import type { ItemDto } from "@eu/types";

export type GenericFilterAvailability = {
  isPending: boolean;
  isError: boolean;
  count: number;
};

export type SelectedFilterValues = {
  category?: string;
  type?: string;
  item?: string;
};

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

export type FilterKeys = keyof SelectedFilterValues | "reset";
