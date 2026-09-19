import type { TypeCreate, TypePatch } from "@/api/generated/model";
import type { ListTypesApiV2TypesGetParams } from "@/api/generated/model";
import type { typeDtos } from "@zod-schemas";
import { typeQuerySchema } from "@zod-schemas";

import { ApiService } from "@/shared/services/apiCrudService";

export default class TypesApi extends ApiService<
  ListTypesApiV2TypesGetParams,
  typeDtos,
  TypeCreate,
  void,
  TypePatch
> {
  protected route = "/types";
  protected querySchema = typeQuerySchema;
}
