import { useMutation } from "@tanstack/react-query";

import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import NexusApi from "@/shared/services/nexusApi";
import type {
  NexusFormBody,
  NexusRequestTypeEnum,
  NexusUpdateDto,
} from "@eu/types";

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

  const importMutation = useMutation({
    mutationFn: async ({ type }: { type: NexusRequestTypeEnum }) => {
      const api = new NexusApi();

      return await api.importBase(type);
    },
    onSuccess: async () => {
      await Promise.all([
        InvalidateQueryAndKeys.nexusMutation(),
        InvalidateQueryAndKeys.typeMutation(),
      ]);
    },
  });

  return { initMutation, updateMutation, importMutation };
}
