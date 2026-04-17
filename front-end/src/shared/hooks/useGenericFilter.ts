import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import type {
  GenericFilterState,
  UseGenericFilterParams,
  UseGenericFilterResult,
} from "../../types/genericFilterType";
import { parseBool, toQueryString } from "../components/GenericFilter/utils";
import useGenericObjectFilter from "./useGenericObjectFilter";

function useGenericFilter<T>({
  items,
  model,
  allowedFields,
  mode = "filter",
  hasIsLimited = false,
  typeById,
  availability = [],
}: UseGenericFilterParams<T>): UseGenericFilterResult<T> {
  const [searchParams, setSearchParams] = useSearchParams();
  const allowedSet = useMemo(() => new Set(allowedFields), [allowedFields]);

  const initialState = useMemo<GenericFilterState>(() => {
    const baseState = model.fields.reduce<GenericFilterState>((acc, field) => {
      acc[field.key] = field.kind === "autocomplete" ? "" : null;
      return acc;
    }, {});

    if (mode === "choice") {
      if (allowedSet.has("item")) {
        baseState.item = searchParams.get("item");
      }
      return baseState;
    }

    if (allowedSet.has("category"))
      baseState.category = searchParams.get("category");
    if (allowedSet.has("type")) baseState.type = searchParams.get("type");
    if (allowedSet.has("search"))
      baseState.search = searchParams.get("search") ?? "";
    if (allowedSet.has("limited"))
      baseState.limited = parseBool(searchParams.get("limited"));

    return baseState;
  }, [allowedSet, mode, model.fields, searchParams]);

  const filter = useGenericObjectFilter<T>({
    items,
    model,
    initialState,
  });

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);

    if (mode === "choice") {
      const itemValue = toQueryString(filter.filterState.item);
      if (itemValue) nextParams.set("item", itemValue);
      else nextParams.delete("item");

      nextParams.delete("category");
      nextParams.delete("type");
      nextParams.delete("search");
      nextParams.delete("limited");
    } else {
      const categoryValue = toQueryString(filter.filterState.category);
      const typeValue = toQueryString(filter.filterState.type);
      const searchValue = toQueryString(filter.filterState.search);
      const limitedValue = toQueryString(filter.filterState.limited);

      if (categoryValue) nextParams.set("category", categoryValue);
      else nextParams.delete("category");
      if (typeValue) nextParams.set("type", typeValue);
      else nextParams.delete("type");
      if (searchValue) nextParams.set("search", searchValue);
      else nextParams.delete("search");
      if (allowedSet.has("limited") && limitedValue)
        nextParams.set("limited", limitedValue);
      else nextParams.delete("limited");

      nextParams.delete("item");
    }

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [allowedSet, filter.filterState, mode, searchParams, setSearchParams]);

  const selectedTypeId =
    typeof filter.filterState.type === "string" && filter.filterState.type
      ? filter.filterState.type
      : null;
  const selectedItemId =
    typeof filter.filterState.item === "string" && filter.filterState.item
      ? filter.filterState.item
      : null;

  const supportsLimited = selectedTypeId
    ? typeById?.[selectedTypeId]?.supportsLimited !== false
    : true;

  const showFilter = availability.length
    ? availability.every(
        (source) =>
          !source.isPending && !source.isError && Number(source.count) > 0,
      )
    : true;

  return {
    filter,
    filteredItems: mode === "filter" ? filter.filteredItems : items,
    selectedItemId,
    showFilter,
    hasIsLimited: hasIsLimited && supportsLimited,
  };
}

export default useGenericFilter;
