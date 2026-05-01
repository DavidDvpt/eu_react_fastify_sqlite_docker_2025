import type { Item, ItemApi, ItemApis, Items } from "@/shared/types";

function parseItem(apiItem: ItemApi): Item {
  const numericValue =
    typeof apiItem.value === "number" ? apiItem.value : Number(apiItem.value);

  return {
    id: apiItem.id,
    name: apiItem.name,
    imageUrlId: apiItem.image_url_id,
    value: Number.isFinite(numericValue) ? numericValue : 0,
    isLimited: apiItem.is_limited,
    isStackable: apiItem.is_stackable,
    typeId: apiItem.item_type_id,
    isActive: apiItem.is_active,
    userId: apiItem.user_id,
    createdAt: apiItem.date_created,
    updatedAt: apiItem.date_updated,
  };
}

function parseItems(apiItems: ItemApis): Items {
  return apiItems.map(parseItem);
}

export { parseItem, parseItems };
