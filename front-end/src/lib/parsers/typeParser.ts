import type { Type, TypeApi, TypeApis, Types } from "../../@types/typeTypes";

function parseType(apiType: TypeApi): Type {
  return {
    id: apiType.id,
    name: apiType.name,
    categoryId: apiType.category_id,
    categoryName: apiType.category?.name,
    isActive: apiType.is_active,
    supportsLimited: apiType.supports_limited,
    isStackable: apiType.is_stackable,
    userId: apiType.user_id,
    createdAt: apiType.date_created,
    updatedAt: apiType.date_updated,
  };
}

function parseTypes(apiTypes: TypeApis): Types {
  return apiTypes.map(parseType);
}

export { parseType, parseTypes };
