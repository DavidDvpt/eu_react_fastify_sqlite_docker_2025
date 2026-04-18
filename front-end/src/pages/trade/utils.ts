import type { Item, Items, Stock, StockRow, Type, Types } from "@/types";

function sortedRowsFunc(stockRows: Stock) {
  return [...stockRows].sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

function typeByIdFunc(types: Types) {
  return types.reduce<Record<string, (typeof types)[number]>>((acc, type) => {
    acc[type.id] = type;
    return acc;
  }, {});
}

function itemByIdFunc(items: Items) {
  return items.reduce<Record<string, (typeof items)[number]>>((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
}

function filterRowsFunc(
  sortedRows: StockRow[],
  typeById: Record<string, Type>,
  itemById: Record<string, Item>,
) {
  return sortedRows.map((row) => {
    const item = itemById[row.itemId];
    const itemType = item ? typeById[item.itemTypeId] : undefined;
    return {
      ...row,
      itemTypeId: item?.itemTypeId ?? null,
      itemTypeName: item?.itemTypeName ?? itemType?.name ?? null,
      categoryId: itemType?.categoryId ?? null,
      categoryName: itemType?.categoryName ?? null,
    };
  });
}

export { sortedRowsFunc, typeByIdFunc, itemByIdFunc, filterRowsFunc };
