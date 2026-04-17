import { useMemo } from "react";
import type {
  FieldType,
  GenericFilterAvailability,
  Item,
  ManageFilterRow,
  Type,
} from "@/types";
import {
  createGenericFilterModel,
  enabledFields,
} from "../components/GenericFilter/constants";
import useGenericFilter from "./useGenericFilter";
import useGenericFilterData from "./useGenericFilterData";

const MANAGE_FILTER_MODEL = createGenericFilterModel<ManageFilterRow>();

type UseManageGenericFilterResult = {
  model: typeof MANAGE_FILTER_MODEL;
  categories: ReturnType<typeof useGenericFilterData>["categories"];
  filteredTypes: Type[];
  filteredItems: Item[];
  filter: ReturnType<typeof useGenericFilter<ManageFilterRow>>["filter"];
  allowedFields: string[];
  showFilter: boolean;
  hasIsLimited: boolean;
  availability: GenericFilterAvailability[];
};

function useManageGenericFilter(
  selectedTab: FieldType | undefined,
): UseManageGenericFilterResult {
  const { categories, types, items, availability } = useGenericFilterData();
  const allowedFields = selectedTab ? enabledFields(selectedTab) : [];

  const typeById = useMemo(
    () =>
      types.reduce<Record<string, Type>>((acc, type) => {
        acc[type.id] = type;
        return acc;
      }, {}),
    [types],
  );

  const itemById = useMemo(
    () =>
      items.reduce<Record<string, Item>>((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {}),
    [items],
  );

  const typeFilterRows = useMemo<ManageFilterRow[]>(
    () =>
      types.map((type) => ({
        categoryId: type.categoryId,
        categoryName: type.categoryName ?? null,
        itemTypeId: type.id,
        itemTypeName: type.name,
        itemId: null,
        name: type.name,
        isLimited: false,
      })),
    [types],
  );

  const itemFilterRows = useMemo<ManageFilterRow[]>(
    () =>
      items.map((item) => {
        const linkedType = typeById[item.itemTypeId];
        return {
          categoryId: linkedType?.categoryId ?? null,
          categoryName: linkedType?.categoryName ?? null,
          itemTypeId: item.itemTypeId,
          itemTypeName: item.itemTypeName ?? linkedType?.name ?? null,
          itemId: item.id,
          name: item.name,
          isLimited: item.isLimited,
        };
      }),
    [items, typeById],
  );

  const sourceRows = selectedTab === "item" ? itemFilterRows : typeFilterRows;
  const hasLimitedFilter = selectedTab === "item";
  const isFilterTab = selectedTab === "item" || selectedTab === "type";

  const { filter, filteredItems, showFilter, hasIsLimited } =
    useGenericFilter<ManageFilterRow>({
      items: sourceRows,
      model: MANAGE_FILTER_MODEL,
      allowedFields,
      mode: "filter",
      hasIsLimited: hasLimitedFilter,
      typeById,
      availability,
    });

  const filteredTypes = useMemo(
    () =>
      (selectedTab === "type" ? filteredItems : typeFilterRows)
        .map((row) => (row.itemTypeId ? typeById[row.itemTypeId] : null))
        .filter((type): type is Type => type !== null),
    [filteredItems, selectedTab, typeById, typeFilterRows],
  );

  const filteredItemsResult = useMemo(
    () =>
      (selectedTab === "item" ? filteredItems : itemFilterRows)
        .map((row) => (row.itemId ? itemById[row.itemId] : null))
        .filter((item): item is Item => item !== null),
    [filteredItems, itemById, itemFilterRows, selectedTab],
  );

  return {
    model: MANAGE_FILTER_MODEL,
    categories,
    filteredTypes,
    filteredItems: filteredItemsResult,
    filter,
    allowedFields,
    showFilter: isFilterTab && showFilter,
    hasIsLimited: isFilterTab && hasIsLimited,
    availability,
  };
}

export default useManageGenericFilter;
