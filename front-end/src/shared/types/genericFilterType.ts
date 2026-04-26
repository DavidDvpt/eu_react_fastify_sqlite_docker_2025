type GenericFilterStateValue = string | boolean | null;
type GenericFilterState = Record<string, GenericFilterStateValue>;

type GenericFilterSelectOption = {
  value: string;
  label: string;
};

type FieldType = "category" | "type" | "item" | "search" | "limited";
type GenericFilterSelectOptions = Record<string, GenericFilterSelectOption[]>;
type GenericFilterAutocompleteOptions = Record<string, string[]>;

type GenericFilterBaseField<T> = {
  key: string;
  label: string;
  hidden?: boolean;
  disabled?: boolean;
  className?: string;
  dependsOn?: string[];
  getValue: (item: T) => string | boolean | null | undefined;
};

type GenericFilterModelItem = {
  categoryId?: string | null;
  categoryName?: string | null;
  itemTypeId?: string | null;
  itemTypeName?: string | null;
  itemId?: string | null;
  name?: string | null;
  isLimited?: boolean;
};

type GenericFilterSelectField<T> = GenericFilterBaseField<T> & {
  kind: "select";
  allLabel?: string;
  getLabel?: (item: T) => string | null | undefined;
};

type GenericFilterBooleanField<T> = GenericFilterBaseField<T> & {
  kind: "boolean";
  allLabel?: string;
  trueLabel?: string;
  falseLabel?: string;
};

type GenericFilterAutocompleteField<T> = GenericFilterBaseField<T> & {
  kind: "autocomplete";
  placeholder?: string;
  noOptionsLabel?: string;
  maxSuggestions?: number;
};

type GenericFilterField<T> =
  | GenericFilterSelectField<T>
  | GenericFilterBooleanField<T>
  | GenericFilterAutocompleteField<T>;

type GenericFilterModel<T> = {
  fields: GenericFilterField<T>[];
};

type GenericFilterProps<T> = {
  model: GenericFilterModel<T>;
  filter: UseGenericObjectFilterResult<T>;
  allowedFields?: string[];
  hasAutocomplete?: boolean;
  hasInput?: boolean;
  hasIsLimited?: boolean;
  className?: string;
};

type GenericFilterMode = "filter" | "choice";

type UseGenericObjectFilterParams<T> = {
  items: T[];
  model: GenericFilterModel<T>;
  initialState?: GenericFilterState;
};

type UseGenericObjectFilterResult<T> = {
  filteredItems: T[];
  filterState: GenericFilterState;
  setFilterValue: (key: string, value: GenericFilterStateValue) => void;
  resetFilters: () => void;
  selectOptions: GenericFilterSelectOptions;
  autocompleteOptions: GenericFilterAutocompleteOptions;
};

type GenericFilterAvailability = {
  isPending: boolean;
  isError: boolean;
  count: number;
};

type UseGenericFilterParams<T> = {
  items: T[];
  model: GenericFilterModel<T>;
  allowedFields: string[];
  mode?: GenericFilterMode;
  hasIsLimited?: boolean;
  typeById?: Record<string, { supportsLimited?: boolean }>;
  availability?: GenericFilterAvailability[];
};

type UseGenericFilterResult<T> = {
  filter: UseGenericObjectFilterResult<T>;
  filteredItems: T[];
  selectedItemId: string | null;
  showFilter: boolean;
  hasIsLimited: boolean;
};

export type {
  GenericFilterProps,
  GenericFilterMode,
  GenericFilterField,
  GenericFilterModel,
  GenericFilterSelectOption,
  GenericFilterState,
  GenericFilterStateValue,
  UseGenericObjectFilterParams,
  UseGenericObjectFilterResult,
  GenericFilterAvailability,
  UseGenericFilterParams,
  UseGenericFilterResult,
  FieldType,
  GenericFilterModelItem,
};
