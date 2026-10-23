import { useMutation } from '@tanstack/react-query';

import { useCreateRefiningSessionApiV2SessionsRefinagePost } from '@/api/generated/react-query/entropiaManagerAPI';
import type { SessionLineCostCreate } from '@/api/generated/react-query/model';
import { InvalidateQueryAndKeys } from '@/lib/react-query/InvalidateQueryAndKeys';

type RefiningMutationParams = {
  /** Item cliqué dans l'inventaire (utilisé pour l'invalidation ciblée). */
  itemId: string;
  resultItemId: string;
  clickCount: number;
  resultQuantity: number;
  costs: SessionLineCostCreate[];
};

function useRefiningMutation() {
  const createSessionApi = useCreateRefiningSessionApiV2SessionsRefinagePost();

  const refineMutation = useMutation({
    mutationFn: async ({
      resultItemId,
      clickCount,
      resultQuantity,
      costs,
    }: RefiningMutationParams) =>
      createSessionApi.mutateAsync({
        data: { resultItemId, clickCount, resultQuantity, costs },
      }),
    onSuccess: async (_data, { itemId }) => {
      await InvalidateQueryAndKeys.refiningMutation({ itemId });
    },
  });

  return { refineMutation };
}

export default useRefiningMutation;
