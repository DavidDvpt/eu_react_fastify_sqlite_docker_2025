import type {
  GenericFilterField,
  GenericFilterModel,
  GenericFilterSelectOption,
  GenericFilterState,
  GenericFilterStateValue,
} from "@/shared/types";

function toQueryString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return value ? "true" : "false";
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

function parseBool(value: string | null): boolean | null {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function normalizeString(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function toComparableValue(value: string | boolean | null | undefined): string {
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return value ?? "";
}

function getDefaultState<T>(model: GenericFilterModel<T>): GenericFilterState {
  return model.fields.reduce<GenericFilterState>((acc, field) => {
    if (field.kind === "autocomplete") {
      acc[field.key] = "";
      return acc;
    }
    acc[field.key] = null;
    return acc;
  }, {});
}

function buildInitialState<T>(
  model: GenericFilterModel<T>,
  initialState?: GenericFilterState,
): GenericFilterState {
  return { ...getDefaultState(model), ...initialState };
}

function getStateSignature(state?: GenericFilterState): string {
  if (!state) return "";
  return Object.keys(state)
    .sort((a, b) => a.localeCompare(b))
    .map((key) => `${key}:${String(state[key])}`)
    .join("|");
}

function areFilterStatesEqual(
  current: GenericFilterState,
  next: GenericFilterState,
): boolean {
  const currentKeys = Object.keys(current);
  const nextKeys = Object.keys(next);
  if (currentKeys.length !== nextKeys.length) return false;

  return currentKeys.every((key) => current[key] === next[key]);
}

function matchesField<T>(
  item: T,
  field: GenericFilterField<T>,
  stateValue: GenericFilterStateValue,
): boolean {
  if (field.kind === "autocomplete") {
    const query = normalizeString(
      typeof stateValue === "string" ? stateValue : "",
    );
    if (!query) return true;

    const itemValue = normalizeString(String(field.getValue(item) ?? ""));
    return itemValue.includes(query);
  }

  if (stateValue === null || stateValue === "") return true;

  const itemValue = field.getValue(item);

  if (field.kind === "boolean") {
    if (typeof stateValue !== "boolean") return true;
    return Boolean(itemValue) === stateValue;
  }

  return toComparableValue(itemValue) === toComparableValue(stateValue);
}

function filterItemsExcludingField<T>(
  items: T[],
  fields: GenericFilterField<T>[],
  state: GenericFilterState,
  excludedFieldKey?: string,
): T[] {
  return items.filter((item) =>
    fields.every((field) => {
      if (field.key === excludedFieldKey) return true;
      const fieldValue = state[field.key] ?? null;
      return matchesField(item, field, fieldValue);
    }),
  );
}

function filterItemsByFieldDependencies<T>(
  items: T[],
  fields: GenericFilterField<T>[],
  state: GenericFilterState,
  field: GenericFilterField<T>,
): T[] {
  const fieldByKey = fields.reduce<Record<string, GenericFilterField<T>>>(
    (acc, currentField) => {
      acc[currentField.key] = currentField;
      return acc;
    },
    {},
  );

  const dependencyKeys =
    field.dependsOn ??
    fields
      .filter((currentField) => currentField.key !== field.key)
      .map((currentField) => currentField.key);

  return items.filter((item) =>
    dependencyKeys.every((dependencyKey) => {
      const dependencyField = fieldByKey[dependencyKey];
      if (!dependencyField) return true;
      const dependencyValue = state[dependencyField.key] ?? null;
      return matchesField(item, dependencyField, dependencyValue);
    }),
  );
}

function buildSelectOptions<T>(
  items: T[],
  fields: GenericFilterField<T>[],
  state: GenericFilterState,
): Record<string, GenericFilterSelectOption[]> {
  const result: Record<string, GenericFilterSelectOption[]> = {};

  fields.forEach((field) => {
    if (field.kind !== "select") return;

    const filteredByDependencies = filterItemsByFieldDependencies(
      items,
      fields,
      state,
      field,
    );

    const optionByValue = new Map<string, string>();

    filteredByDependencies.forEach((item) => {
      const value = field.getValue(item);
      const comparableValue = toComparableValue(
        typeof value === "string" ? value : null,
      );
      if (!comparableValue) return;

      if (optionByValue.has(comparableValue)) return;
      const label = field.getLabel?.(item) ?? comparableValue;
      optionByValue.set(comparableValue, label);
    });

    result[field.key] = [...optionByValue.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "fr"));
  });

  return result;
}

function buildAutocompleteOptions<T>(
  items: T[],
  fields: GenericFilterField<T>[],
  state: GenericFilterState,
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  fields.forEach((field) => {
    if (field.kind !== "autocomplete") return;

    const filteredByDependencies = filterItemsByFieldDependencies(
      items,
      fields,
      state,
      field,
    );
    const currentQuery = normalizeString(
      typeof state[field.key] === "string" ? String(state[field.key]) : "",
    );

    const uniqueValues = new Set<string>();
    filteredByDependencies.forEach((item) => {
      const rawValue = field.getValue(item);
      if (typeof rawValue !== "string") return;
      const value = rawValue.trim();
      if (!value) return;
      if (currentQuery && !normalizeString(value).includes(currentQuery))
        return;
      uniqueValues.add(value);
    });

    const sortedValues = [...uniqueValues].sort((a, b) =>
      a.localeCompare(b, "fr"),
    );
    const limit = field.maxSuggestions ?? 20;
    result[field.key] = sortedValues.slice(0, limit);
  });

  return result;
}

export {
  parseBool,
  toQueryString,
  getDefaultState,
  buildInitialState,
  buildSelectOptions,
  buildAutocompleteOptions,
  filterItemsExcludingField,
  areFilterStatesEqual,
  getStateSignature,
  toComparableValue,
};
