import type { Item, Items } from "./itemTypes";
import type { Type, Types } from "./typeTypes";
import type { Categories, Category } from "./categoryTypes";
import type { GenericFilterAvailability } from "./genericFilterType";

type ManageTab = "category" | "type" | "item";

export type ManageListRow = Category | Type | Item;

type ManageTableProps = {
  activeTab: ManageTab;
  categories: Categories;
  typesRows: Types;
  itemsRows: Items;
  availability: GenericFilterAvailability[];
};

type ManageFilterRow = {
  categoryId: string | null;
  categoryName: string | null;
  itemTypeId: string | null;
  itemTypeName: string | null;
  itemId: string | null;
  name: string;
  isLimited: boolean;
};

export type { ManageTab, ManageTableProps, ManageFilterRow };
