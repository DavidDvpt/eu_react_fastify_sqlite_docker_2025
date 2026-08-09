import type { TypeDto, TypeFormBody, TypeQuerySchema } from "@eu/types";
import { typeQuerySchema } from "@eu/zod-schemas";

import { ApiService } from "@/shared/services/apiCrudService";

export default class TypesApi extends ApiService<
  TypeQuerySchema,
  TypeDto[],
  TypeFormBody
> {
  protected route = "/types";
  protected querySchema = typeQuerySchema;
}
