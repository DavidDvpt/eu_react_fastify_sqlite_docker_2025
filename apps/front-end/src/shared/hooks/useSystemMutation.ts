import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import CategoryApi from "@/shared/services/categoriesApi";
import type { CategoryDto, CategoryFormBody } from "@eu/types";
import { useMutation } from "@tanstack/react-query";

export default function useSystemMutation() {
  const categoryMutation = useMutation({
    mutationFn: async ({
      category,
      values,
    }: {
      category?: CategoryDto;
      values: CategoryFormBody;
    }) => {
      const cs = new CategoryApi();
      if (category?.id) {
        return await cs.patch({ id: category?.id, body: values });
      } else {
        return await cs.create(values);
      }
    },
    onSuccess: async () => {
      await InvalidateQueryAndKeys.categoryMutation();
    },
  });

  return { categoryMutation };
}
