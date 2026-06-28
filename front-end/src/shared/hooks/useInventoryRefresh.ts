import { useQueryClient } from "@tanstack/react-query";

function useInventoryRefresh(itemId: string, onBack: () => void) {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["items-stock"] }),
      queryClient.invalidateQueries({
        queryKey: ["stock", "details", itemId],
      }),
    ]);
    onBack();
  };
}

export default useInventoryRefresh;
