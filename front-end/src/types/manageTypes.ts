import type { MANAGE_TAB_META } from "@/pages/manage";
import type { Items } from "./itemTypes";
import type { Types } from "./typeTypes";
import type { Categories } from "./categoryTypes";

type ManageTab = keyof typeof MANAGE_TAB_META;

type ManageTableProps = {
  activeTab: ManageTab;
  categories: Categories;
  typesRows: Types;
  itemsRows: Items;
  isCategoriesPending: boolean;
  isCategoriesError: boolean;
  isTypesPending: boolean;
  isTypesError: boolean;
  isItemsPending: boolean;
  isItemsError: boolean;
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
