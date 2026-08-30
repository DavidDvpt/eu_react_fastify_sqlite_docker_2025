import { useQuery } from "@tanstack/react-query";

import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import NexusApi from "@/shared/services/nexusApi";

function useNexusData() {
  const api = new NexusApi();

  const { data, isLoading, isError } = useQuery({
    queryKey: InvalidateQueryAndKeys.getNexusKey().keys,
    queryFn: () => api.get(),
    staleTime: 30_000,
  });

  return {
    nexusRows: data ?? [],
    isNexusLoading: isLoading,
    isNexusError: isError,
  };
}

export default useNexusData;
