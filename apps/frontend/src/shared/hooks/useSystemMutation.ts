import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import { ItemsApi, TypesApi } from "@/shared/services";
import CategoryApi from "@/shared/services/categoriesApi";
import type {
  CategoryDto,
  CategoryFormBody,
  ItemDto,
  ItemForm,
  TypeDto,
  TypeFormBody,
} from "@eu/zod-schemas";
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

  const typeMutation = useMutation({
    mutationFn: async ({
      type,
      values,
    }: {
      type?: TypeDto;
      values: TypeFormBody;
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
      item?: ItemDto;
      values: ItemForm;
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
