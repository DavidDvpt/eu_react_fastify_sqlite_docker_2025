import type { FieldType } from "@/@types";
import { useCategories, useItems, useTypes } from "@/pages/manage";

interface UseManageFilterProps {
  enabled: FieldType[];
}
function useGenericFilter({ enabled }: UseManageFilterProps) {
  const visible = new Set(enabled);
  const {
    data: categories = [],
    isPending: categoriesPending,
    isError: categoriesError,
  } = useCategories({ enabled: visible.has("category") });

  const {
    data: types = [],
    isPending: typesPending,
    isError: typesError,
  } = useTypes({ enabled: visible.has("type") || visible.has("item") });

  const {
    data: items = [],
    isPending: itemsPending,
    isError: itemsError,
  } = useItems({ enabled: visible.has("item") });

  return {
    categories,
    categoriesPending,
    categoriesError,
    types,
    typesPending,
    typesError,
    items,
    itemsPending,
    itemsError,
  };
}

export { useGenericFilter };
