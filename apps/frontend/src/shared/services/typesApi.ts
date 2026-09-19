import type { typeDtos, TypeFormBody, TypeQuery } from "@zod-schemas";
import { typeQuerySchema } from "@zod-schemas";

import { ApiService } from "@/shared/services/apiCrudService";

export default class TypesApi extends ApiService<
  TypeQuery,
  typeDtos,
  TypeFormBody
> {
  protected route = "/types";
  protected querySchema = typeQuerySchema;
}
