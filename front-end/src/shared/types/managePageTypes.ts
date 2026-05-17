import type { Item, Items } from "./itemTypes";
import type { Type, Types } from "./typeTypes";
import type { Categories, Category } from "./categoryTypes";
import type { GenericFilterAvailability } from "./genericFilterType";
import type { MANAGE_TABS } from "../../modules/manage/utils";

export type ManageTab = (typeof MANAGE_TABS)[number];

export type ManageListRow = Category | Type | Item;

export type ManageTableProps = {
  activeTab: ManageTab;
  categories: Categories;
  typesRows: Types;
  itemsRows: Items;
  availability: GenericFilterAvailability[];
};

export type ManageFilterRow = {
  categoryId: string | null;
  categoryName: string | null;
  itemTypeId: string | null;
  itemTypeName: string | null;
  itemId: string | null;
  name: string;
  isLimited: boolean;
};
