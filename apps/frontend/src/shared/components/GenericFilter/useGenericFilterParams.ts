// @shared/hooks/useQueryParams.tsx

import type { GenericFilterValues } from "@/shared/types";
import { useMemo } from "react";

import { useLocation } from "react-router-dom";
import { allOptionValue } from "./genericFilter.utils";
import { genericFilterSchema } from "@/shared/components/GenericFilter/genericFilterSchema";

type QueryParamValues = string | number | boolean | undefined;

const useGenericFilterParams = () => {
  const location = useLocation();

  const params = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);

    const p: GenericFilterValues = {
      categoryId:
        searchParams.get("categoryId") === allOptionValue
          ? ""
          : searchParams.get("categoryId") || "",
      typeId:
        searchParams.get("typeId") === allOptionValue
          ? ""
          : searchParams.get("typeId") || "",
      itemId: searchParams.get("itemId") || "",
    };

    const parse = genericFilterSchema.parse(p);
    return parse;
  }, [location.search]);

  const constructQuery = (key: string, value: QueryParamValues): string => {
    const searchParams = new URLSearchParams(location.search);

    if (key === undefined) return "";

    if (!value || value === allOptionValue) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value.toString());
    }

    return searchParams.toString() ?? "";
  };

  return { params, constructQuery, allOptionValue };
};

export default useGenericFilterParams;
