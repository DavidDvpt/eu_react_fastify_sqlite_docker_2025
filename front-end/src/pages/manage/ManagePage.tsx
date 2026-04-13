import { useMemo } from "react";
import {
  createItemFilterModel,
  createTypeFilterModel,
  useGenericObjectFilter,
} from "@/components/common/GenericFilter";
import {
  MANAGE_TAB_META,
  isManageTab,
  useCategories,
  useItems,
  useTypes,
} from "@/modules/manage";
import { Link, useLocation, useParams } from "react-router-dom";
import type { Item, ManageTab, Type } from "@/modules/manage";
import { sortByName } from "./utils";
import { ManageFilter } from "./components/ManageFilter";
import { ManageTable } from "./components/ManageTable";

const TYPE_FILTER_MODEL = createTypeFilterModel<Type>();

function ManagePage() {
  const { tab, id } = useParams();
  const { pathname } = useLocation();

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
    [sortedTypes]
  );

  const itemFilterModel = useMemo(
    () => createItemFilterModel<Item, Type>(typeById),
    [typeById]
  );

  const itemFilter = useGenericObjectFilter<Item>({
    items: sortedItems,
    model: itemFilterModel,
  });

  const selectedItemTypeId =
    typeof itemFilter.filterState.type === "string"
      ? itemFilter.filterState.type
      : null;
  const selectedItemType = selectedItemTypeId ? typeById[selectedItemTypeId] : null;
  const hasLimitedForSelectedType =
    !selectedItemType || selectedItemType.supportsLimited !== false;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">{meta.title}</h1>
        <p className="text-sm text-muted-foreground">{meta.description}</p>
      </header>

      <div className="flex items-center gap-2">
        <Link
          to={`/manage/${activeTab}/create`}
          className="rounded-md border border-primary-500 bg-primary-500 px-3 py-2 text-sm font-medium text-white"
        >
          Creer
        </Link>
      </div>

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

      <section className="overflow-hidden rounded-md border border-border bg-background">
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
      </section>

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
