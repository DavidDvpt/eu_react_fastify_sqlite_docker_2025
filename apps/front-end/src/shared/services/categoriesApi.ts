import type { CategoryDto, CategoryFormBody } from "@eu/types";
import { categoryQuerySchema } from "@eu/zod-schemas";
import { z } from "zod";

import { ApiService } from "@/shared/services/apiCrudService";

type CategoryQuerySchema = z.infer<typeof categoryQuerySchema>;

export default class CategoryApi extends ApiService<
  CategoryQuerySchema,
  CategoryDto[],
  CategoryFormBody
> {
  protected route = "/categories";
  protected querySchema = categoryQuerySchema;
}
