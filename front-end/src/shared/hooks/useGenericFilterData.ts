// @shared/hooks/useGenericFilter.ts

import { useMemo } from "react";
import useCategories from "./useCategories";
import useTypes from "./useTypes";
import useItems from "./useItems";
import { allOptionValue } from "../components/GenericFilter/genericFilter.utils";

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
  const { categories } = useCategories();
  const { types } = useTypes();
  const { items } = useItems();

  // --- 1. Types ---
  const filteredTypes = useMemo(() => {
    if (category === "__all__") {
      return types ?? [];
    }
    // Ajustez la propriété 'categoryId' selon votre type
    return types.filter((t) => t.categoryId === category);
  }, [types, category]);

  // --- 2. Items ---
  const filteredItems = useMemo(() => {
    if (type === "__all__") {
      return items;
    }
    // Ajustez la propriété 'typeId' selon votre item
    return items.filter((i) => i.itemTypeId === type);
  }, [items, type]);

  // --- 3. Formatters ---
  const categoriesForSelect = useMemo(
    () =>
      categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    [categories],
  );

  const typesForSelect = useMemo(
    () => filteredTypes.map((t) => ({ value: t.id, label: t.name })),
    [filteredTypes],
  );

  const itemsForSelect = useMemo(
    () => filteredItems.map((i) => ({ value: i.id, label: i.name })),
    [filteredItems],
  );

  return {
    categories, // Ou une version filtrée si besoin
    filteredTypes,
    filteredItems,
    categoriesForSelect,
    typesForSelect,
    itemsForSelect,
    // On peut aussi renvoyer le statut du filtre (ex: 'items' = true/false) si nécessaire
    // itemsAvailable: filteredItems.length > 0,
  };
};
