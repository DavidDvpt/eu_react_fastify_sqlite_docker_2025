import { useQuery } from "@tanstack/react-query";
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

function formatToFiveDecimals(value: unknown): string {
  const numericValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numericValue)) {
    return "0.00000";
  }
  return numericValue.toFixed(5);
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
  const {
    data: types = [],
    isPending: typesPending,
    isError: typesError,
  } = useQuery({
    queryKey: ["manage", "types"],
    queryFn: getTypes,
    enabled: activeTab === "type",
  });
  const {
    data: items = [],
    isPending: itemsPending,
    isError: itemsError,
  } = useQuery({
    queryKey: ["manage", "items"],
    queryFn: getItems,
    enabled: activeTab === "item",
  });

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
                <th className="px-4 py-3 font-semibold text-foreground">Nom</th>
                <th className="px-4 py-3 font-semibold text-foreground">Scope</th>
              </tr>
            </thead>
            <tbody>
              {categoriesPending ? (
                <tr>
                  <td className="px-4 py-4 text-muted-foreground" colSpan={2}>
                    Chargement des categories...
                  </td>
                </tr>
              ) : categoriesError ? (
                <tr>
                  <td className="px-4 py-4 text-danger" colSpan={2}>
                    Impossible de charger les categories (endpoint attendu: {CATEGORIES_ROUTE}).
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-muted-foreground" colSpan={2}>
                    Aucune categorie.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-border last:border-b-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <Link
                        to={`/manage/category/${category.id}/edit`}
                        className="font-medium text-foreground no-underline"
                      >
                        {category.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {category.userId ? "Custom" : "Global"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      ) : activeTab === "type" ? (
        <section className="overflow-hidden rounded-md border border-border bg-background">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="px-4 py-3 font-semibold text-foreground">Nom</th>
                <th className="px-4 py-3 font-semibold text-foreground">Categorie</th>
                <th className="px-4 py-3 font-semibold text-foreground">Scope</th>
              </tr>
            </thead>
            <tbody>
              {typesPending ? (
                <tr>
                  <td className="px-4 py-4 text-muted-foreground" colSpan={3}>
                    Chargement des types...
                  </td>
                </tr>
              ) : typesError ? (
                <tr>
                  <td className="px-4 py-4 text-danger" colSpan={3}>
                    Impossible de charger les types (endpoint attendu: {TYPES_ROUTE}).
                  </td>
                </tr>
              ) : types.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-muted-foreground" colSpan={3}>
                    Aucun type.
                  </td>
                </tr>
              ) : (
                types.map((type) => (
                  <tr key={type.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link
                        to={`/manage/type/${type.id}/edit`}
                        className="font-medium text-foreground no-underline"
                      >
                        {type.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {type.categoryName ?? type.categoryId}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {type.userId ? "Custom" : "Global"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      ) : activeTab === "item" ? (
        <section className="overflow-hidden rounded-md border border-border bg-background">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="px-4 py-3 font-semibold text-foreground">Nom</th>
                <th className="px-4 py-3 font-semibold text-foreground">Type</th>
                <th className="px-4 py-3 font-semibold text-foreground">Valeur</th>
                <th className="px-4 py-3 font-semibold text-foreground">Limite</th>
                <th className="px-4 py-3 font-semibold text-foreground">Scope</th>
              </tr>
            </thead>
            <tbody>
              {itemsPending ? (
                <tr>
                  <td className="px-4 py-4 text-muted-foreground" colSpan={5}>
                    Chargement des items...
                  </td>
                </tr>
              ) : itemsError ? (
                <tr>
                  <td className="px-4 py-4 text-danger" colSpan={5}>
                    Impossible de charger les items (endpoint attendu: {ITEMS_ROUTE}).
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-muted-foreground" colSpan={5}>
                    Aucun item.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link
                        to={`/manage/item/${item.id}/edit`}
                        className="font-medium text-foreground no-underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.itemTypeName ?? item.itemTypeId}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatToFiveDecimals(item.value)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.isLimited ? "Oui" : "Non"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.userId ? "Custom" : "Global"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
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
