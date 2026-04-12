import { useQuery } from "@tanstack/react-query";
import { type ReactNode, useMemo } from "react";
import {
  CATEGORIES_ROUTE,
  ITEMS_ROUTE,
  MANAGE_TAB_META,
  TYPES_ROUTE,
  getCategories,
  getItems,
  getTypes,
  isManageTab,
} from "@/modules/manage";
import { Link, useLocation, useParams } from "react-router-dom";
import type { ManageTab } from "@/modules/manage";
import {
  createItemFilterModel,
  createTypeFilterModel,
  GenericFilter,
  useGenericObjectFilter,
} from "@/components/common/GenericFilter";
import type { GenericFilterModel } from "@/components/common/GenericFilter";
import type { Item, Type } from "@/modules/manage";

const TYPE_FILTER_MODEL = createTypeFilterModel<Type>();
const API_URL = import.meta.env.VITE_API_URL ?? "";

function TableHeadCell({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 font-semibold text-foreground">{children}</th>;
}

function TableMessageCell({
  children,
  colSpan,
  tone = "muted",
}: {
  children: ReactNode;
  colSpan: number;
  tone?: "muted" | "danger";
}) {
  return (
    <td className={`px-4 py-4 ${tone === "danger" ? "text-danger" : "text-muted-foreground"}`} colSpan={colSpan}>
      {children}
    </td>
  );
}

function TableBodyCell({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "muted";
}) {
  return (
    <td className={`px-4 py-1.5 ${tone === "muted" ? "text-muted-foreground" : ""}`}>
      {children}
    </td>
  );
}

function formatToFiveDecimals(value: unknown): string {
  const numericValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numericValue)) {
    return "0.00000";
  }
  return numericValue.toFixed(5);
}

function sortByName<T extends { name?: string }>(items: T[]): T[] {
  return [...items].sort((left, right) =>
    (left.name ?? "").localeCompare(right.name ?? "", "fr", {
      sensitivity: "base",
    })
  );
}

function getItemImageUrl(imageUrlId: string): string | null {
  const normalizedApiUrl = API_URL.replace(/\/+$/, "");
  if (!normalizedApiUrl || !imageUrlId) {
    return null;
  }
  return `${normalizedApiUrl}/storage/images/${encodeURIComponent(imageUrlId)}/normal`;
}

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
  } = useQuery({
    queryKey: ["manage", "categories"],
    queryFn: getCategories,
    enabled: activeTab === "category",
  });
  const sortedCategories = useMemo(() => sortByName(categories), [categories]);

  const {
    data: types = [],
    isPending: typesPending,
    isError: typesError,
  } = useQuery({
    queryKey: ["manage", "types"],
    queryFn: getTypes,
    enabled: activeTab === "type" || activeTab === "item",
  });
  const sortedTypes = useMemo(() => sortByName(types), [types]);

  const {
    data: items = [],
    isPending: itemsPending,
    isError: itemsError,
  } = useQuery({
    queryKey: ["manage", "items"],
    queryFn: getItems,
    enabled: activeTab === "item",
  });
  const sortedItems = useMemo(() => sortByName(items), [items]);

  const typeFilterModel = TYPE_FILTER_MODEL;

  const typeFilter = useGenericObjectFilter<Type>({
    items: sortedTypes,
    model: typeFilterModel,
    initialState: { isActive: true },
  });

  const typeById = useMemo(
    () =>
      sortedTypes.reduce<Record<string, Type>>((acc, type) => {
        acc[type.id] = type;
        return acc;
      }, {}),
    [sortedTypes]
  );

  const itemFilterModel = useMemo<GenericFilterModel<Item>>(
    () => createItemFilterModel<Item, Type>(typeById),
    [typeById]
  );

  const itemFilter = useGenericObjectFilter<Item>({
    items: sortedItems,
    model: itemFilterModel,
    initialState: { isActive: true },
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

      {activeTab === "category" ? (
        <section className="overflow-hidden rounded-md border border-border bg-background">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <TableHeadCell>Nom</TableHeadCell>
                <TableHeadCell>Scope</TableHeadCell>
              </tr>
            </thead>
            <tbody>
              {categoriesPending ? (
                <tr>
                  <TableMessageCell colSpan={2}>Chargement des categories...</TableMessageCell>
                </tr>
              ) : categoriesError ? (
                <tr>
                  <TableMessageCell colSpan={2} tone="danger">
                    Impossible de charger les categories (endpoint attendu: {CATEGORIES_ROUTE}).
                  </TableMessageCell>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <TableMessageCell colSpan={2}>Aucune categorie.</TableMessageCell>
                </tr>
              ) : (
                sortedCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-border last:border-b-0 hover:bg-muted/30"
                  >
                    <TableBodyCell>
                      <Link
                        to={`/manage/category/${category.id}/edit`}
                        className="font-medium text-foreground no-underline"
                      >
                        {category.name}
                      </Link>
                    </TableBodyCell>
                    <TableBodyCell tone="muted">
                      {category.userId ? "Custom" : "Global"}
                    </TableBodyCell>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      ) : activeTab === "type" ? (
        <div className="space-y-4">
          {!typesPending && !typesError && types.length > 0 ? (
            <GenericFilter model={typeFilterModel} filter={typeFilter} hasInput />
          ) : null}

          <section className="overflow-hidden rounded-md border border-border bg-background">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <TableHeadCell>Nom</TableHeadCell>
                  <TableHeadCell>Categorie</TableHeadCell>
                  <TableHeadCell>Scope</TableHeadCell>
                </tr>
              </thead>
              <tbody>
                {typesPending ? (
                  <tr>
                    <TableMessageCell colSpan={3}>Chargement des types...</TableMessageCell>
                  </tr>
                ) : typesError ? (
                  <tr>
                    <TableMessageCell colSpan={3} tone="danger">
                      Impossible de charger les types (endpoint attendu: {TYPES_ROUTE}).
                    </TableMessageCell>
                  </tr>
                ) : typeFilter.filteredItems.length === 0 ? (
                  <tr>
                    <TableMessageCell colSpan={3}>Aucun type.</TableMessageCell>
                  </tr>
                ) : (
                  typeFilter.filteredItems.map((type) => (
                    <tr key={type.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                      <TableBodyCell>
                        <Link
                          to={`/manage/type/${type.id}/edit`}
                          className="font-medium text-foreground no-underline"
                        >
                          {type.name}
                        </Link>
                      </TableBodyCell>
                      <TableBodyCell tone="muted">
                        {type.categoryName ?? type.categoryId}
                      </TableBodyCell>
                      <TableBodyCell tone="muted">
                        {type.userId ? "Custom" : "Global"}
                      </TableBodyCell>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </div>
      ) : activeTab === "item" ? (
        <div className="space-y-4">
          {!itemsPending && !itemsError && items.length > 0 ? (
            <GenericFilter
              model={itemFilterModel}
              filter={itemFilter}
              hasInput
              hasIsLimited={hasLimitedForSelectedType}
            />
          ) : null}

          <section className="overflow-hidden rounded-md border border-border bg-background">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <TableHeadCell>Image</TableHeadCell>
                  <TableHeadCell>Nom</TableHeadCell>
                  <TableHeadCell>Type</TableHeadCell>
                  <TableHeadCell>Valeur</TableHeadCell>
                  <TableHeadCell>Limited</TableHeadCell>
                  <TableHeadCell>Stackable</TableHeadCell>
                  <TableHeadCell>Scope</TableHeadCell>
                </tr>
              </thead>
              <tbody>
                {itemsPending ? (
                  <tr>
                    <TableMessageCell colSpan={7}>Chargement des items...</TableMessageCell>
                  </tr>
                ) : itemsError ? (
                  <tr>
                    <TableMessageCell colSpan={7} tone="danger">
                      Impossible de charger les items (endpoint attendu: {ITEMS_ROUTE}).
                    </TableMessageCell>
                  </tr>
                ) : itemFilter.filteredItems.length === 0 ? (
                  <tr>
                    <TableMessageCell colSpan={7}>Aucun item.</TableMessageCell>
                  </tr>
                ) : (
                  itemFilter.filteredItems.map((item) => (
                    <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                      <TableBodyCell tone="muted">
                        {getItemImageUrl(item.imageUrlId) ? (
                          <img
                            src={getItemImageUrl(item.imageUrlId) ?? ""}
                            alt={item.name}
                            className="h-8 w-8 rounded object-contain"
                            loading="lazy"
                          />
                        ) : (
                          "-"
                        )}
                      </TableBodyCell>
                      <TableBodyCell>
                        <Link
                          to={`/manage/item/${item.id}/edit`}
                          className="font-medium text-foreground no-underline"
                        >
                          {item.name}
                        </Link>
                      </TableBodyCell>
                      <TableBodyCell tone="muted">
                        {item.itemTypeName ?? item.itemTypeId}
                      </TableBodyCell>
                      <TableBodyCell tone="muted">
                        {formatToFiveDecimals(item.value)}
                      </TableBodyCell>
                      <TableBodyCell tone="muted">{item.isLimited ? "Oui" : "Non"}</TableBodyCell>
                      <TableBodyCell tone="muted">
                        {item.isStackable ? "Oui" : "Non"}
                      </TableBodyCell>
                      <TableBodyCell tone="muted">
                        {item.userId ? "Custom" : "Global"}
                      </TableBodyCell>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </div>
      ) : (
        <section className="rounded-md border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
          {isCreate
            ? `Mode creation pour "${activeTab}".`
            : isEdit
              ? `Mode edition pour "${activeTab}" (id: ${id}).`
              : `Mode liste pour "${activeTab}" (table + lignes cliquables).`}
        </section>
      )}
    </div>
  );
}

export default ManagePage;
