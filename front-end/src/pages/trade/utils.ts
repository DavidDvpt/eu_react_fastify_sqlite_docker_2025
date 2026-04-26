import type { Item, StockRow, Type } from "@/shared/types";

function filterRowsFunc(
  rows: StockRow[],
  typeById: Record<string, Type>,
  itemById: Record<string, Item>,
) {
  return rows.map((row) => {
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

export { filterRowsFunc };
