import type { MANAGE_TAB_META } from "@/pages/manage";
import type {
  GenericFilterModel,
  UseGenericObjectFilterResult,
} from "./genericFilterType";
import type { Item, Items } from "./itemTypes";
import type { Type, Types } from "./typeTypes";
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

type ManageFilterProps = {
  activeTab: ManageTab;
  types: Type[];
  items: Item[];
  isTypesPending: boolean;
  isTypesError: boolean;
  isItemsPending: boolean;
  isItemsError: boolean;
  typeFilterModel: GenericFilterModel<Type>;
  typeFilter: UseGenericObjectFilterResult<Type>;
  itemFilterModel: GenericFilterModel<Item>;
  itemFilter: UseGenericObjectFilterResult<Item>;
  hasLimitedForSelectedType: boolean;
};

export type { ManageFilterProps, ManageTab, ManageTableProps };
