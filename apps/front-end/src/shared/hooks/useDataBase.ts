import useCategories from "./useCategories";
import useItems from "./useItems";
import useTypes from "./useTypes";

interface UseDataBaseParams {
  typeId?: string;
  categoryId?: string;
  prefillSelect?: boolean;
}
function useDataBase({
  typeId,
  categoryId,
  prefillSelect = true,
}: UseDataBaseParams) {
  const categoriesData = useCategories();
  const typesData = useTypes({ categoryId, prefillSelect });
  const itemsData = useItems({ categoryId, typeId, prefillSelect });

  return { categoriesData, typesData, itemsData };
}

export default useDataBase;
