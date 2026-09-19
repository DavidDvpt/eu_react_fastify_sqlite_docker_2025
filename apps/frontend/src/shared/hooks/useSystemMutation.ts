import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import { ItemsApi, TypesApi } from "@/shared/services";
import CategoryApi from "@/shared/services/categoriesApi";
import type { CategoryCreateOutput } from "@/api/generated/zod/model/categoryCreate.zod";
import type { ItemCreateOutput } from "@/api/generated/zod/model/itemCreate.zod";
import type { TypeCreateOutput } from "@/api/generated/zod/model/typeCreate.zod";
import type {
  CategoryViewModel,
  ItemViewModel,
  TypeViewModel,
} from "@zod-schemas";
import { useMutation } from "@tanstack/react-query";

export default function useSystemMutation() {
  const categoryMutation = useMutation({
    mutationFn: async ({
      category,
      values,
    }: {
      category?: CategoryViewModel;
      values: CategoryCreateOutput;
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

  const typeMutation = useMutation({
    mutationFn: async ({
      type,
      values,
    }: {
      type?: TypeViewModel;
      values: TypeCreateOutput;
    }) => {
      const ts = new TypesApi();
      if (type?.id) {
        return await ts.patch({ id: type?.id, body: values });
      } else {
        return await ts.create(values);
      }
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
      const itemsApi = new ItemsApi();
      if (item?.id) {
        return await itemsApi.patch({ id: item.id, body: values });
      }

      return await itemsApi.create(values);
    },
    onSuccess: async () => {
      await InvalidateQueryAndKeys.itemMutation();
    },
  });

  return { categoryMutation, typeMutation, itemMutation };
}
