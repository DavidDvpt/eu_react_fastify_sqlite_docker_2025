// @shared/hooks/useQueryParams.tsx

import type { SelectedFilterValues } from "@/shared/types";
import { useMemo } from "react";

import { useLocation } from "react-router-dom";
import { allOptionValue } from "./genericFilter.utils";

type QueryParamValues = string | number | boolean | undefined;

const useGenericFilterParams = () => {
  const location = useLocation();

  const params = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);

    const f: SelectedFilterValues = {
      category: searchParams.get("category") || "",
      type: searchParams.get("type") || "",
      item: searchParams.get("item") || "",
    };

    return f;
  }, [location.search]);

  const constructQuery = (key: string, value: QueryParamValues): string => {
    const searchParams = new URLSearchParams(location.search);

    if (key === undefined) return "";

    searchParams.set(key, value?.toString() ?? "");

    return searchParams.toString() ?? "";
  };

  return { params, constructQuery, allOptionValue };
};

export default useGenericFilterParams;
