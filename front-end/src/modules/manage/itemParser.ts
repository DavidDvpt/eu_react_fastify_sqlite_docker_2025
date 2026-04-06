import type { Item, ItemApi, ItemApis, Items } from "./itemTypes";

function parseItem(apiItem: ItemApi): Item {
  const numericValue =
    typeof apiItem.value === "number" ? apiItem.value : Number(apiItem.value);

  return {
    id: apiItem.id,
    name: apiItem.name,
    imageUrlId: apiItem.image_url_id,
    value: Number.isFinite(numericValue) ? numericValue : 0,
    isLimited: apiItem.is_limited,
    itemTypeId: apiItem.item_type_id,
    itemTypeName: apiItem.item_type?.name,
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
