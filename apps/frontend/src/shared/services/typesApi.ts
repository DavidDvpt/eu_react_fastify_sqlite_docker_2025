import type { typeDtos, TypeQuery } from "@zod-schemas";
import type { TypeCreate, TypePatch } from "@/api/generated/model";
import { typeQuerySchema } from "@zod-schemas";

import { ApiService } from "@/shared/services/apiCrudService";

export default class TypesApi extends ApiService<
  TypeQuery,
  typeDtos,
  TypeCreate,
  void,
  TypePatch
> {
  protected route = "/types";
  protected querySchema = typeQuerySchema;
}