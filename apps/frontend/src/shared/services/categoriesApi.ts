import type {
  CategoryDto,
  CategoryFormBody,
  CategoryQuery,
} from "@zod-schemas";
import { systemQuerySchema } from "@zod-schemas";

import { ApiService } from "@/shared/services/apiCrudService";

export default class CategoryApi extends ApiService<
  CategoryQuery,
  CategoryDto[],
  CategoryFormBody
> {
  protected route = "/categories";
  protected querySchema = systemQuerySchema;
}
