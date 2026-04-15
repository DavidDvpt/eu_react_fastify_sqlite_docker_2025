import { GenericFilter } from "@/components/common/GenericFilter";
import type {
  GenericFilterModel,
  UseGenericObjectFilterResult,
} from "@/components/common/GenericFilter";
import type { Item, ManageTab, Type } from "@/modules/manage";

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

function ManageFilter({
  activeTab,
  types,
  items,
  isTypesPending,
  isTypesError,
  isItemsPending,
  isItemsError,
  typeFilterModel,
  typeFilter,
  itemFilterModel,
  itemFilter,
  hasLimitedForSelectedType,
}: ManageFilterProps) {
  if (activeTab === "type") {
    if (isTypesPending || isTypesError || types.length === 0) {
      return null;
    }
    return (
      <GenericFilter model={typeFilterModel} filter={typeFilter} hasInput />
    );
  }

  if (activeTab === "item") {
    if (isItemsPending || isItemsError || items.length === 0) {
      return null;
    }
    return (
      <GenericFilter
        model={itemFilterModel}
        filter={itemFilter}
        hasInput
        hasIsLimited={hasLimitedForSelectedType}
      />
    );
  }

  return null;
}

export { ManageFilter };
