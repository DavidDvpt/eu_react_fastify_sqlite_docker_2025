import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTypes } from "@/pages/manage/services/typesApi";
import { SelectOptionHelper } from "../components/form/Select/select.utils";

type UseTypesParams = {
  enabled?: boolean;
};

function useTypes({ enabled = true }: UseTypesParams = {}) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["types"],
    queryFn: getTypes,
    enabled,
    staleTime: Infinity,
  });

  const invalidateTypes = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["types"] }),
    [queryClient],
  );

  const typesForSelect = (categoryId?: string) => {
    const list = categoryId
      ? (query.data?.filter((type) => type.categoryId === categoryId) ?? [])
      : (query.data ?? []);

    return list.map((type) =>
      SelectOptionHelper({
        id: type.id,
        label: type.name,
      }),
    );
  };

  return {
    ...query,
    invalidateTypes,
    typesForSelect,
  };
}

export default useTypes;
