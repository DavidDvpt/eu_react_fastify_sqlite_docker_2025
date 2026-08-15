// @shared/hooks/useGenericFilter.ts

import { useMemo } from "react";
import { selectOptionsHelper } from "@/shared/helpers/selectHelper";
import { useSystemDatas } from "@/shared/hooks";

/**
 * Hook de gestion des données filtrées.
 * Il ne gère plus l'URL, seulement le filtrage des listes.
 */
export const useGenericFilterData = ({
  params,
}: {
  params: { category?: string; type?: string };
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
    return selectOptionsHelper(typesByCategory(params.category));
  }, [params.category, typesByCategory]);

  const itemsForSelect = useMemo(() => {
    return selectOptionsHelper(
      filteredItems({ categoryId: params.category, typeId: params.type }),
    );
  }, [filteredItems, params]);

  return {
    categoriesForSelect,
    typesForSelect,
    itemsForSelect,
  };
};
