// @shared/hooks/useGenericFilter.ts

import { useMemo } from "react";
import { allOptionValue } from "./genericFilter.utils";
import useDataBase from "@/shared/hooks/useDataBase";
import { selectOptionsHelper } from "@/shared/helpers/select.helper";

/**
 * Hook de gestion des données filtrées.
 * Il ne gère plus l'URL, seulement le filtrage des listes.
 */
export const useGenericFilterData = ({
  category = allOptionValue,
  type = allOptionValue,
}: {
  category?: string;
  type?: string;
}) => {
  const {
    categoriesData,
    typesData: { filteredTypes },
    itemsData: { filteredItems },
  } = useDataBase({ typeId: type, categoryId: category });

  // --- 3. Formatters ---
  const categoriesForSelect = useMemo(() => {
    const categories = categoriesData.data ?? [];
    return selectOptionsHelper(categories);
  }, [categoriesData.data]);

  const typesForSelect = useMemo(() => {
    return selectOptionsHelper(filteredTypes);
  }, [filteredTypes]);

  const itemsForSelect = useMemo(() => {
    return selectOptionsHelper(filteredItems);
  }, [filteredItems]);

  return {
    categoriesForSelect,
    typesForSelect,
    itemsForSelect,
  };
};
