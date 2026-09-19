// @shared/hooks/useGenericFilter.ts

import { useMemo } from "react";
import { selectOptionsHelper } from "@/shared/helpers/selectHelper";
import { useSystemDatas } from "@/shared/hooks";
import type { GenericFilterValues } from "@/shared/types";

/**
 * Hook de gestion des données filtrées.
 * Il ne gère plus l'URL, seulement le filtrage des listes.
 */
export const useGenericFilterData = ({
  params,
}: {
  params: GenericFilterValues;
}) => {
  const {
    categories,
    types: { typesByCategory },
    items: { filteredItems },
  } = useSystemDatas();

  // --- 3. Formatters ---
  const categoriesForSelect = useMemo(() => {
    return selectOptionsHelper(categories.data ?? []);
  }, [categories.data]);

  const typesForSelect = useMemo(() => {
    return selectOptionsHelper(typesByCategory(params.categoryId));
  }, [params.categoryId, typesByCategory]);

  const itemsForSelect = useMemo(() => {
    return selectOptionsHelper(
      filteredItems({ categoryId: params.categoryId, typeId: params.typeId }),
    );
  }, [filteredItems, params]);

  return {
    categoriesForSelect,
    typesForSelect,
    itemsForSelect,
  };
};
