import type { Item, Items } from "../../shared/types/itemTypes";
import type { Type, Types } from "../../shared/types/typeTypes";
import type { Categories, Category } from "../../shared/types/categoryTypes";
import type { GenericFilterAvailability } from "../../shared/types/genericFilterType";
import type { MANAGE_TABS } from "./managePage.utils";

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
