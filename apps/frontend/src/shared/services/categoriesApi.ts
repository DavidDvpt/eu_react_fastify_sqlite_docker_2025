import type { CategoryDto, CategoryQuery } from "@zod-schemas";
import type { CategoryCreate, CategoryPatch } from "@/api/generated/model";
import { systemQuerySchema } from "@zod-schemas";

import { ApiService } from "@/shared/services/apiCrudService";

export default class CategoryApi extends ApiService<
  CategoryQuery,
  CategoryDto[],
  CategoryCreate,
  void,
  CategoryPatch
> {
  protected route = "/categories";
  protected querySchema = systemQuerySchema;
}