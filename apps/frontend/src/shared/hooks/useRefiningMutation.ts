import { useMutation } from "@tanstack/react-query";

import { useCreateRefinageSessionApiV2RefinageCreatePost } from "@/api/generated/react-query/entropiaManagerAPI";
import type { RefinageOrigin } from "@/api/generated/react-query/model";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import type { RefiningProvenance } from "@/shared/helpers/refining";

type RefiningMutationParams = {
  /** Item cliqué dans l'inventaire (utilisé pour l'invalidation ciblée). */
  itemId: string;
  result: string;
  clickCount: number;
  origin: RefinageOrigin[];
  provenance: RefiningProvenance[];
};

function useRefiningMutation() {
  const createSessionApi = useCreateRefinageSessionApiV2RefinageCreatePost();

  const refineMutation = useMutation({
    mutationFn: async ({
      result,
      clickCount,
      origin,
      provenance,
    }: RefiningMutationParams) =>
      createSessionApi.mutateAsync({
        data: { result, clickCount, origin, provenance },
      }),
    onSuccess: async (_data, { itemId }) => {
      await InvalidateQueryAndKeys.refiningMutation({ itemId });
    },
  });

  return { refineMutation };
}

export default useRefiningMutation;