import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import type { CategoryCreateOutput } from "@/api/generated/zod/model/categoryCreate.zod";
import type { ItemCreateOutput } from "@/api/generated/zod/model/itemCreate.zod";
import type { TypeCreateOutput } from "@/api/generated/zod/model/typeCreate.zod";
import {
  useCreateCategoryApiV2CategoriesPost,
  useCreateItemApiV2ItemsPost,
  useCreateTypeApiV2TypesPost,
  usePatchCategoryApiV2CategoriesIdPatch,
  usePatchItemApiV2ItemsIdPatch,
  usePatchTypeApiV2TypesIdPatch,
} from "@/api/generated/react-query/entropiaManagerAPI";
import type {
  CategoryViewModel,
  ItemViewModel,
  TypeViewModel,
} from "@zod-schemas";
import { useMutation } from "@tanstack/react-query";

export default function useSystemMutation() {
  const createCategory = useCreateCategoryApiV2CategoriesPost();
  const patchCategory = usePatchCategoryApiV2CategoriesIdPatch();
  const createType = useCreateTypeApiV2TypesPost();
  const patchType = usePatchTypeApiV2TypesIdPatch();
  const createItem = useCreateItemApiV2ItemsPost();
  const patchItem = usePatchItemApiV2ItemsIdPatch();

  const categoryMutation = useMutation({
    mutationFn: async ({
      category,
      values,
    }: {
      category?: CategoryViewModel;
      values: CategoryCreateOutput;
    }) => {
      if (category?.id) {
        return await patchCategory.mutateAsync({ id: category.id, data: values });
      }
      return await createCategory.mutateAsync({ data: values });
    },
    onSuccess: async () => {
      await InvalidateQueryAndKeys.categoryMutation();
    },
  });

  const typeMutation = useMutation({
    mutationFn: async ({
      type,
      values,
    }: {
      type?: TypeViewModel;
      values: TypeCreateOutput;
    }) => {
      if (type?.id) {
        return await patchType.mutateAsync({ id: type.id, data: values });
      }
      return await createType.mutateAsync({ data: values });
    },
    onSuccess: async () => {
      await InvalidateQueryAndKeys.typeMutation();
    },
  });

  const itemMutation = useMutation({
    mutationFn: async ({
      item,
      values,
    }: {
      item?: ItemViewModel;
      values: ItemCreateOutput;
    }) => {
      if (item?.id) {
        return await patchItem.mutateAsync({ id: item.id, data: values });
      }

      return await createItem.mutateAsync({ data: values });
    },
    onSuccess: async () => {
      await InvalidateQueryAndKeys.itemMutation();
    },
  });

  return { categoryMutation, typeMutation, itemMutation };
}
