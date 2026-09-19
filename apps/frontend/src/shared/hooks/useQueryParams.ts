import { useMemo } from "react";
import { useLocation } from "react-router-dom";

type QueryParamValue = string | string[];
type QueryParams = Record<string, QueryParamValue>;

export default function useQueryParams<
  TParams extends QueryParams = QueryParams,
>() {
  const location = useLocation();

  const params = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const nextParams: QueryParams = {};

    for (const [key, value] of searchParams.entries()) {
      const currentValue = nextParams[key];

      if (currentValue === undefined) {
        nextParams[key] = value;
        continue;
      }

      nextParams[key] = Array.isArray(currentValue)
        ? [...currentValue, value]
        : [currentValue, value];
    }

    return nextParams as TParams;
  }, [location.search]);

  return params;
}
