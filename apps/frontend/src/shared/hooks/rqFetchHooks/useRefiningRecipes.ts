import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  getGetRecipeByResultApiV2RefinageRecipeResultItemIdGetQueryOptions,
  useGetResultsByOriginApiV2RefinageRecipeOriginItemIdGet,
} from "@/api/generated/react-query/entropiaManagerAPI";
import type { RefinageRecipeResponse } from "@/api/generated/react-query/model";

/** Résultats qui utilisent l'item comme ingrédient (`GET /refinage/recipe/origin`). */
export function useRefinageResultsByOrigin(
  itemId: string | null | undefined,
) {
  return useGetResultsByOriginApiV2RefinageRecipeOriginItemIdGet(itemId ?? "", {
    query: {
      enabled: Boolean(itemId),
      staleTime: 30_000,
    },
  });
}

/**
 * Lignes d'ingrédients de chaque recette candidate, une requête par résultat
 * (`GET /refinage/recipe/result`). Nécessaire pour calculer la faisabilité et
 * la quantité maximale de chaque recette.
 */
export function useRefinageRecipeLines(resultIds: string[]) {
  const queries = useQueries({
    queries: resultIds.map((resultId) =>
      getGetRecipeByResultApiV2RefinageRecipeResultItemIdGetQueryOptions(
        resultId,
        { query: { staleTime: 30_000 } },
      ),
    ),
  });

  const recipeLinesByResult = useMemo(() => {
    const map = new Map<string, RefinageRecipeResponse[]>();
    resultIds.forEach((resultId, index) => {
      map.set(resultId, queries[index]?.data ?? []);
    });
    return map;
  }, [queries, resultIds]);

  return {
    recipeLinesByResult,
    isLinesLoading: queries.some((query) => query.isLoading),
    isLinesError: queries.some((query) => query.isError),
  };
}