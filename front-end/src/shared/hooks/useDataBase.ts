import useCategories from "./useCategories";
import useItems from "./useItems";
import useTypes from "./useTypes";

interface UseDataBaseParams {
  typeId?: string;
  categoryId?: string;
}
function useDataBase({ typeId, categoryId }: UseDataBaseParams) {
  const categoriesData = useCategories();
  const typesData = useTypes({ categoryId });
  const itemsData = useItems({ typeId });

  return { categoriesData, typesData, itemsData };
}

export default useDataBase;
