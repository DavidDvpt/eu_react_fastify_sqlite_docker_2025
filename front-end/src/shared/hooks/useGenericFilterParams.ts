// @shared/hooks/useQueryParams.tsx

import { useEffect, useRef, useState } from "react";
import type { SelectedFilterValues } from "../types";

type QueryParamValues = string | number | boolean | undefined;

const useGenericFilterParams = () => {
  const allOptionValue = "__all__";
  const defaultValues = {
    category: allOptionValue,
    type: allOptionValue,
    item: allOptionValue,
  } as SelectedFilterValues;
  const [params, setParams] = useState<SelectedFilterValues>(defaultValues);
  const queryParamsRef = useRef<SelectedFilterValues | null>(null);

  useEffect(() => {
    if (queryParamsRef.current) {
      setParams(queryParamsRef.current);
      queryParamsRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Update the ref with new query parameters
    const searchParams = new URLSearchParams(window.location.search);

    const filterParams: SelectedFilterValues = {
      category: searchParams.get("category") || allOptionValue,
      type: searchParams.get("type") || allOptionValue,
      item: searchParams.get("item") || allOptionValue,
    };

    queryParamsRef.current = filterParams;

    return () => {
      // Cleanup if needed
    };
  }, [params]);

  const constructQuery = (key: string, value: QueryParamValues): string => {
    const searchParams = new URLSearchParams();

    if (key === undefined) return "";

    searchParams.set(key, value?.toString() ?? "");

    return searchParams.toString() ?? "";
  };

  return { params, constructQuery, allOptionValue };
};

export default useGenericFilterParams;
