import { useMemo } from "react";
import {
  createGenericFilterModel,
  GenericFilter,
  useGenericFilter,
} from "@/shared/components/GenericFilter";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ManageTable } from "./components/ManageTable";
import { Button } from "@/components/ui/button";
import { Panel } from "@/shared/components/Containers";

import { enabledFields } from "@/shared/components/GenericFilter/constants";

import type { FieldType, Item, ManageFilterRow, Type } from "@/types";
import { useCategories, useItems, useTypes } from "@/shared/hooks";

const MANAGE_FILTER_MODEL = createGenericFilterModel<ManageFilterRow>();

function ManagePage() {
  const { tab, id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const selectedTab = tab as FieldType | undefined;
  const enabled = selectedTab ? enabledFields(selectedTab) : [];
  const displayAllowed = selectedTab && enabled.includes(selectedTab);

  const {
    data: categories = [],
    isPending: categoriesPending,
    isError: categoriesError,
  } = useCategories();
  const {
    data: types = [],
    isPending: typesPending,
    isError: typesError,
  } = useTypes();
  const {
    data: items = [],
    isPending: itemsPending,
    isError: itemsError,
  } = useItems();

  const availability = [
    {
      isPending: categoriesPending,
      isError: categoriesError,
      count: categories.length,
    },
    { isPending: typesPending, isError: typesError, count: types.length },
    { isPending: itemsPending, isError: itemsError, count: items.length },
  ];

  const typeById = useMemo(
    () =>
      types.reduce<Record<string, Type>>((acc, type) => {
        acc[type.id] = type;
        return acc;
      }, {}),
    [types],
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

  const {
    filter: itemFilterState,
    filteredItems: filteredItemRows,
    showFilter: showItemFilter,
    hasIsLimited,
  } = useGenericFilter<ManageFilterRow>({
    items: itemFilterRows,
    model: MANAGE_FILTER_MODEL,
    allowedFields: ["category", "type", "search", "limited"],
    mode: "filter",
    hasIsLimited: true,
    typeById,
    availability,
  });

  const filteredItems = useMemo(
    () =>
      filteredItemRows
        .map((row) =>
          row.itemId ? items.find((item) => item.id === row.itemId) : null,
        )
        .filter((item): item is Item => item !== null),
    [filteredItemRows, items],
  );

  const {
    filter: typeFilterState,
    filteredItems: filteredTypeRows,
    showFilter: showTypeFilter,
  } = useGenericFilter<ManageFilterRow>({
    items: typeFilterRows,
    model: MANAGE_FILTER_MODEL,
    allowedFields: ["category", "type", "search"],
    mode: "filter",
    availability,
  });

  const filteredTypes = useMemo(
    () =>
      filteredTypeRows
        .map((row) =>
          row.itemTypeId
            ? types.find((type) => type.id === row.itemTypeId)
            : null,
        )
        .filter((type): type is Type => type !== null),
    [filteredTypeRows, types],
  );

  const isCreate = pathname.endsWith("/create");
  const isEdit = pathname.endsWith("/edit") && Boolean(id);

  return (
    <Panel>
      {displayAllowed && (
        <div className="flex justify-end items-center py-2">
          <Button
            variant="primary"
            onClick={() => navigate(`/manage/${tab}/create`)}
          >
            Créer
          </Button>
        </div>
      )}

      {selectedTab === "type" && showTypeFilter ? (
        <GenericFilter
          model={MANAGE_FILTER_MODEL}
          filter={typeFilterState}
          allowedFields={["category", "type", "search"]}
          hasAutocomplete
        />
      ) : null}

      {selectedTab === "item" && showItemFilter ? (
        <GenericFilter
          model={MANAGE_FILTER_MODEL}
          filter={itemFilterState}
          allowedFields={["category", "type", "search", "limited"]}
          hasAutocomplete
          hasIsLimited={hasIsLimited}
        />
      ) : null}

      <ManageTable
        activeTab={(tab as FieldType) ?? "category"}
        categories={categories}
        typesRows={filteredTypes}
        itemsRows={filteredItems}
        isCategoriesPending={categoriesPending}
        isCategoriesError={categoriesError}
        isTypesPending={typesPending}
        isTypesError={typesError}
        isItemsPending={itemsPending}
        isItemsError={itemsError}
      />

      {isCreate || isEdit ? (
        <section className="rounded-md border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
          {isCreate
            ? `Mode creation pour "${tab}".`
            : `Mode edition pour "${tab}" (id: ${id}).`}
        </section>
      ) : null}
    </Panel>
  );
}

export default ManagePage;
