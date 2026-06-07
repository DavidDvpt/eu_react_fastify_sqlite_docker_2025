import type { Type, TypeApi, TypeApis, Types } from "@/shared/types";

function parseType(apiType: TypeApi): Type {
  return {
    id: apiType.id,
    name: apiType.name,
    categoryId: apiType.category_id,
    categoryName: apiType.category?.name ?? "Unknown",
    isActive: apiType.is_active,
    supportsLimited: apiType.supports_limited ?? false,
    isStackable: apiType.is_stackable ?? false,
    userId: apiType.user_id ?? null,
    createdAt: apiType.date_created,
    updatedAt: apiType.date_updated,
  };
}

function parseTypes(apiTypes: TypeApis): Types {
  return apiTypes.map(parseType);
}

export { parseType, parseTypes };
