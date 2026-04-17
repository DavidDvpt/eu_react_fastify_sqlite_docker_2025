import { GenericFilter } from "@/shared/components/GenericFilter";
import type { ManageFilterProps } from "../../../@types/manageTypes";

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
