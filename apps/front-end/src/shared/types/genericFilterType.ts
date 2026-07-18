import type { Item } from "./itemTypes";

type GenericFilterStateValue = string | boolean | null;
type GenericFilterState = Record<string, GenericFilterStateValue>;

export type GenericFilterSelectOption = {
  value: string;
  label: string;
};

export type FieldType = "category" | "type" | "item" | "search" | "limited";
export type GenericFilterSelectOptions = Record<
  string,
  GenericFilterSelectOption[]
>;
type GenericFilterAutocompleteOptions = Record<string, string[]>;

export type GenericFilterBaseField<T> = {
  key: string;
  label: string;
  hidden?: boolean;
  disabled?: boolean;
  className?: string;
  dependsOn?: string[];
  getValue: (item: T) => string | boolean | null | undefined;
};

export type GenericFilterModelItem = {
  categoryId?: string | null;
  categoryName?: string | null;
  itemTypeId?: string | null;
  itemTypeName?: string | null;
  itemId?: string | null;
  name?: string | null;
  isLimited?: boolean;
};

export type GenericFilterSelectField<T> = GenericFilterBaseField<T> & {
  kind: "select";
  allLabel?: string;
  getLabel?: (item: T) => string | null | undefined;
};

export type GenericFilterBooleanField<T> = GenericFilterBaseField<T> & {
  kind: "boolean";
  allLabel?: string;
  trueLabel?: string;
  falseLabel?: string;
};

export type GenericFilterAutocompleteField<T> = GenericFilterBaseField<T> & {
  kind: "autocomplete";
  placeholder?: string;
  noOptionsLabel?: string;
  maxSuggestions?: number;
};

export type GenericFilterField<T> =
  | GenericFilterSelectField<T>
  | GenericFilterBooleanField<T>
  | GenericFilterAutocompleteField<T>;

export type GenericFilterModel<T> = {
  fields: GenericFilterField<T>[];
};

export type GenericFilterMode = "filter" | "choice";

export type UseGenericObjectFilterParams<T> = {
  items: T[];
  model: GenericFilterModel<T>;
  initialState?: GenericFilterState;
};

export type UseGenericObjectFilterResult<T> = {
  filteredItems: T[];
  filterState: GenericFilterState;
  setFilterValue: (key: string, value: GenericFilterStateValue) => void;
  resetFilters: () => void;
  selectOptions: GenericFilterSelectOptions;
  autocompleteOptions: GenericFilterAutocompleteOptions;
};

export type GenericFilterAvailability = {
  isPending: boolean;
  isError: boolean;
  count: number;
};

export type UseGenericFilterParams<T> = {
  items: T[];
  model: GenericFilterModel<T>;
  allowedFields: string[];
  mode?: GenericFilterMode;
  hasIsLimited?: boolean;
  typeById?: Record<string, { supportsLimited?: boolean }>;
  availability?: GenericFilterAvailability[];
};

export type UseGenericFilterResult<T> = {
  filter: UseGenericObjectFilterResult<T>;
  filteredItems: T[];
  selectedItemId: string | null;
  showFilter: boolean;
  hasIsLimited: boolean;
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
  | "manageCategory"
  | "manageType"
  | "manageItem"
  | "inventory"
  | "transaction";
export interface GenericFilterProps {
  className?: string;
  selectedItem?: Item | null;
  context?: GenericFilterContext;
  onSelectedItem?: (item: string) => void;
  onSelectedType?: (type: string) => void;
}

export type FilterKeys = keyof SelectedFilterValues | "reset";
