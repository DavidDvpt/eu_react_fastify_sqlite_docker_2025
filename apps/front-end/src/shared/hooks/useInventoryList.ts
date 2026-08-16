import useGenericFilterParams from "@/shared/components/GenericFilter/useGenericFilterParams";
import { useSystemDatas } from "@/shared/hooks";
import useInventoryStockData from "@/shared/hooks/rqFetchHooks/useInventoryStockData";

function useInventoryList() {
  const { params } = useGenericFilterParams();
  const {
    items: { isError: isItemsError, isLoading: isItemLoading },
  } = useSystemDatas();
  const { inventoryStock, isInventoryStockError, isInventoryStockLoading } =
    useInventoryStockData();

  const isError = isItemsError || isInventoryStockError;
  const isLoading = isItemLoading || isInventoryStockLoading;

  return {
    inventoryStock,
    isError,
    isLoading,
    selectedItem: params.item,
  };
}

export default useInventoryList;
