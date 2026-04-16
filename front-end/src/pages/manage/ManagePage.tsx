import { useMemo } from "react";
import {
  createItemFilterModel,
  createTypeFilterModel,
  useGenericObjectFilter,
} from "@/shared/components/GenericFilter";
import {
  MANAGE_TAB_META,
  isManageTab,
  useCategories,
  useItems,
  useTypes,
} from "@/modules/manage";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { Item, ManageTab, Type } from "@/modules/manage";
import { sortByName } from "./utils";
import { ManageFilter } from "./components/ManageFilter";
import { ManageTable } from "./components/ManageTable";

import { Button } from "@/components/ui/button";

const TYPE_FILTER_MODEL = createTypeFilterModel<Type>();

function ManagePage() {
  const { tab, id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const activeTab: ManageTab = isManageTab(tab) ? tab : "category";
  const meta = MANAGE_TAB_META[activeTab];

  const isCreate = pathname.endsWith("/create");
  const isEdit = pathname.endsWith("/edit") && Boolean(id);

  const {
    data: categories = [],
    isPending: categoriesPending,
    isError: categoriesError,
  } = useCategories({ enabled: activeTab === "category" });

  const sortedCategories = useMemo(() => sortByName(categories), [categories]);

  const {
    data: types = [],
    isPending: typesPending,
    isError: typesError,
  } = useTypes({ enabled: activeTab === "type" || activeTab === "item" });
  const sortedTypes = useMemo(() => sortByName(types), [types]);

  const {
    data: items = [],
    isPending: itemsPending,
    isError: itemsError,
  } = useItems({ enabled: activeTab === "item" });
  const sortedItems = useMemo(() => sortByName(items), [items]);

  const typeFilter = useGenericObjectFilter<Type>({
    items: sortedTypes,
    model: TYPE_FILTER_MODEL,
  });

  const typeById = useMemo(
    () =>
      sortedTypes.reduce<Record<string, Type>>((acc, type) => {
        acc[type.id] = type;
        return acc;
      }, {}),
    [sortedTypes],
  );

  const itemFilterModel = useMemo(
    () => createItemFilterModel<Item, Type>(typeById),
    [typeById],
  );

  const itemFilter = useGenericObjectFilter<Item>({
    items: sortedItems,
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
    <div className="space-y-2">
      <header className="space-y-2 flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-card-title mt-0">
          {meta.title}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => navigate(`/manage/${activeTab}/create`)}
          >
            Créer
          </Button>
        </div>
      </header>

      <ManageFilter
        activeTab={activeTab}
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

      <ManageTable
        activeTab={activeTab}
        categories={sortedCategories}
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
            ? `Mode creation pour "${activeTab}".`
            : `Mode edition pour "${activeTab}" (id: ${id}).`}
        </section>
      ) : null}
    </div>
  );
}

export default ManagePage;
