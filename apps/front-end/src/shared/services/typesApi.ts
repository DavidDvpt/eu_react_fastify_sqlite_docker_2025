import type { typeDtos, TypeFormBody, TypeQuery } from "@eu/zod-schemas";
import { typeQuerySchema } from "@eu/zod-schemas";

import { ApiService } from "@/shared/services/apiCrudService";

export default class TypesApi extends ApiService<
  TypeQuery,
  typeDtos,
  TypeFormBody
> {
  protected route = "/types";
  protected querySchema = typeQuerySchema;
}
