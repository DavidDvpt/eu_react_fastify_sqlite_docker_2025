import { useMutation } from "@tanstack/react-query";

import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import NexusApi from "@/shared/services/nexusApi";

export default function useNexusMutation() {
  const initMutation = useMutation({
    mutationFn: async () => {
      const api = new NexusApi();

      return await api.init();
    },
    onSuccess: async () => {
      await InvalidateQueryAndKeys.nexusInitMutation();
    },
  });

  return { initMutation };
}
