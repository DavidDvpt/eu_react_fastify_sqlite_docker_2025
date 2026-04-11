type GenericFilterStateValue = string | boolean | null;
type GenericFilterState = Record<string, GenericFilterStateValue>;

type GenericFilterSelectOption = {
  value: string;
  label: string;
};

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
  hasInput?: boolean;
  hasIsLimited?: boolean;
  className?: string;
};

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

export type {
  GenericFilterProps,
  GenericFilterAutocompleteField,
  GenericFilterAutocompleteOptions,
  GenericFilterBooleanField,
  GenericFilterField,
  GenericFilterModel,
  GenericFilterSelectField,
  GenericFilterSelectOption,
  GenericFilterSelectOptions,
  GenericFilterState,
  GenericFilterStateValue,
  UseGenericObjectFilterParams,
  UseGenericObjectFilterResult,
};
