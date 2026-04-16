import type { Item, MANAGE_TAB_META, Type } from "@/pages/manage";
import type {
  GenericFilterModel,
  UseGenericObjectFilterResult,
} from "@/shared/components/GenericFilter";

type ManageTab = keyof typeof MANAGE_TAB_META;

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

export type { ManageFilterProps, ManageTab };
