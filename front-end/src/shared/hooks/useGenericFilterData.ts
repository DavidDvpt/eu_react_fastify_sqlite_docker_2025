import type { GenericFilterAvailability } from "@/types";
import useCategories from "./useCategories";
import useItems from "./useItems";
import useTypes from "./useTypes";

function useGenericFilterData() {
  const {
    data: categories = [],
    isPending: categoriesPending,
    isError: categoriesError,
  } = useCategories();
  const {
    data: types = [],
    isPending: typesPending,
    isError: typesError,
  } = useTypes();
  const {
    data: items = [],
    isPending: itemsPending,
    isError: itemsError,
  } = useItems();

  const availability: GenericFilterAvailability[] = [
    {
      isPending: categoriesPending,
      isError: categoriesError,
      count: categories.length,
    },
    { isPending: typesPending, isError: typesError, count: types.length },
    { isPending: itemsPending, isError: itemsError, count: items.length },
  ];

  return { types, items, categories, availability };
}

export default useGenericFilterData;
