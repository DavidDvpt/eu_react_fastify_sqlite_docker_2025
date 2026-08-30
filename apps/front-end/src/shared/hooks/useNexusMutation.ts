import { useMutation } from "@tanstack/react-query";

import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import NexusApi from "@/shared/services/nexusApi";
import type { NexusFormBody, NexusUpdateDto } from "@eu/types";

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

  const updateMutation = useMutation({
    mutationFn: async ({
      nexus,
      values,
    }: {
      nexus: NexusUpdateDto;
      values: NexusFormBody;
    }) => {
      const api = new NexusApi();

      return await api.patch({ id: nexus.id, body: values });
    },
    onSuccess: async () => {
      await InvalidateQueryAndKeys.nexusMutation();
    },
  });

  return { initMutation, updateMutation };
}
