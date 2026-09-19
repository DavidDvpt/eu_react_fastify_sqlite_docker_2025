import type { CategoryCreate, CategoryPatch } from "@/api/generated/model";
import type { ListCategoriesApiV2CategoriesGetParams } from "@/api/generated/model";
import { ListCategoriesApiV2CategoriesGetParams as listCategoriesParamsSchema } from "@/api/generated/zod/model/listCategoriesApiV2CategoriesGetParams.zod";
import type { CategoryDto } from "@zod-schemas";

import { ApiService } from "@/shared/services/apiCrudService";

export default class CategoryApi extends ApiService<
  ListCategoriesApiV2CategoriesGetParams,
  CategoryDto[],
  CategoryCreate,
  void,
  CategoryPatch
> {
  protected route = "/categories";
  protected querySchema = listCategoriesParamsSchema;
}
