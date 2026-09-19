import type {
  CategoryDto,
  CategoryFormBody,
  CategoryQuery,
} from "@eu/zod-schemas";
import { systemQuerySchema } from "@eu/zod-schemas";

import { ApiService } from "@/shared/services/apiCrudService";

export default class CategoryApi extends ApiService<
  CategoryQuery,
  CategoryDto[],
  CategoryFormBody
> {
  protected route = "/categories";
  protected querySchema = systemQuerySchema;
}
