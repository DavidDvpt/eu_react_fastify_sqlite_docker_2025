import { useMemo } from "react";
import {
  createItemFilterModel,
  createTypeFilterModel,
  useGenericObjectFilter,
} from "@/shared/components/GenericFilter";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { ManageFilter } from "./components/ManageFilter";
import { ManageTable } from "./components/ManageTable";
import { Button } from "@/components/ui/button";
import { Panel } from "@/shared/components/Containers";

import type { FieldType, Item, Type } from "@/@types";
import { enabledFields } from "@/shared/components/GenericFilter/constants";
import { useGenericFilter } from "@/shared/components/GenericFilter/hooks/useGenericFilter";

const TYPE_FILTER_MODEL = createTypeFilterModel<Type>();

function ManagePage() {
  const { tab, id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const selectedTab = tab as FieldType | undefined;
  const enabled = selectedTab ? enabledFields(selectedTab) : [];
  const displayAllowed = selectedTab && enabled.includes(selectedTab);

  const {
    categories,
    categoriesPending,
    categoriesError,
    types,
    typesPending,
    typesError,
    items,
    itemsPending,
    itemsError,
  } = useGenericFilter({ enabled });

  const isCreate = pathname.endsWith("/create");
  const isEdit = pathname.endsWith("/edit") && Boolean(id);

  const typeFilter = useGenericObjectFilter<Type>({
    items: types,
    model: TYPE_FILTER_MODEL,
  });

  const typeById = useMemo(
    () =>
      types.reduce<Record<string, Type>>((acc, type) => {
        acc[type.id] = type;
        return acc;
      }, {}),
    [types],
  );

  const itemFilterModel = useMemo(
    () => createItemFilterModel<Item, Type>(typeById),
    [typeById],
  );

  const itemFilter = useGenericObjectFilter<Item>({
    items: items,
    model: itemFilterModel,
  });

  const selectedItemTypeId =
    typeof itemFilter.filterState.type === "string"
      ? itemFilter.filterState.type
      : null;
  const selectedItemType = selectedItemTypeId
    ? typeById[selectedItemTypeId]
    : null;
  const hasLimitedForSelectedType =
    !selectedItemType || selectedItemType.supportsLimited !== false;

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

      {displayAllowed && (
        <ManageFilter
          activeTab={tab as FieldType}
          types={types}
          items={items}
          isTypesPending={typesPending}
          isTypesError={typesError}
          isItemsPending={itemsPending}
          isItemsError={itemsError}
          typeFilterModel={TYPE_FILTER_MODEL}
          typeFilter={typeFilter}
          itemFilterModel={itemFilterModel}
          itemFilter={itemFilter}
          hasLimitedForSelectedType={hasLimitedForSelectedType}
        />
      )}

      <ManageTable
        activeTab={(tab as FieldType) ?? "category"}
        categories={categories}
        typesRows={typeFilter.filteredItems}
        itemsRows={itemFilter.filteredItems}
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
