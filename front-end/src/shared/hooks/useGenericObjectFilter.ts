import { useEffect, useMemo, useRef, useState } from "react";

import type {
  GenericFilterState,
  GenericFilterStateValue,
  UseGenericObjectFilterParams,
  UseGenericObjectFilterResult,
} from "@/types";
import {
  areFilterStatesEqual,
  buildAutocompleteOptions,
  buildInitialState,
  buildSelectOptions,
  filterItemsExcludingField,
  getStateSignature,
  toComparableValue,
} from "../components/GenericFilter/utils";

function useGenericObjectFilter<T>({
  items,
  model,
  initialState,
}: UseGenericObjectFilterParams<T>): UseGenericObjectFilterResult<T> {
  const skipNextInitialSyncRef = useRef(false);
  const initialStateSignature = getStateSignature(initialState);
  const stableInitialStateRef = useRef(initialState);
  const stableInitialStateSignatureRef = useRef(initialStateSignature);

  if (stableInitialStateSignatureRef.current !== initialStateSignature) {
    stableInitialStateRef.current = initialState;
    stableInitialStateSignatureRef.current = initialStateSignature;
  }

  const computedInitialState = useMemo(() => {
    const signature = initialStateSignature;
    void signature;
    return buildInitialState(model, stableInitialStateRef.current);
  }, [initialStateSignature, model]);
  const [filterState, setFilterState] =
    useState<GenericFilterState>(computedInitialState);

  useEffect(() => {
    if (skipNextInitialSyncRef.current) {
      skipNextInitialSyncRef.current = false;
      return;
    }

    setFilterState((currentState) =>
      areFilterStatesEqual(currentState, computedInitialState)
        ? currentState
        : computedInitialState,
    );
  }, [computedInitialState]);

  const filteredItems = useMemo(
    () => filterItemsExcludingField(items, model.fields, filterState),
    [filterState, items, model.fields],
  );

  const selectOptions = useMemo(
    () => buildSelectOptions(items, model.fields, filterState),
    [filterState, items, model.fields],
  );

  const autocompleteOptions = useMemo(
    () => buildAutocompleteOptions(items, model.fields, filterState),
    [filterState, items, model.fields],
  );

  useEffect(() => {
    let nextState: GenericFilterState | null = null;

    model.fields.forEach((field) => {
      if (field.kind !== "select") return;

      const currentValue = filterState[field.key];
      if (currentValue === null || currentValue === "") return;
      const fieldOptions = selectOptions[field.key] ?? [];
      const hasCurrentValue = fieldOptions.some(
        (option) => option.value === toComparableValue(String(currentValue)),
      );

      if (!hasCurrentValue) {
        nextState ??= { ...filterState };
        nextState[field.key] = null;
      }
    });

    if (nextState) {
      setFilterState(nextState);
    }
  }, [filterState, model.fields, selectOptions]);

  function setFilterValue(key: string, value: GenericFilterStateValue) {
    setFilterState((current) => ({ ...current, [key]: value }));
  }

  function resetFilters() {
    skipNextInitialSyncRef.current = true;
    setFilterState(buildInitialState(model));
  }

  return {
    filteredItems,
    filterState,
    setFilterValue,
    resetFilters,
    selectOptions,
    autocompleteOptions,
  };
}

export default useGenericObjectFilter;
