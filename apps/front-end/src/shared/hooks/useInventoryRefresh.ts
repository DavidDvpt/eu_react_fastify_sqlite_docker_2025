import { useQueryClient } from "@tanstack/react-query";

function useInventoryRefresh(itemId: string, onBack: () => void) {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["items-stock"] }),
      queryClient.invalidateQueries({ queryKey: ["running-transactions"] }),
      queryClient.invalidateQueries({
        queryKey: ["stock", "details", itemId],
      }),
      queryClient.invalidateQueries({ queryKey: ["pedcard"] }),
    ]);
    onBack();
  };
}

export default useInventoryRefresh;
