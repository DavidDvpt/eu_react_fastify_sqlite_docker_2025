import { useQuery } from "@tanstack/react-query";
import {
  CATEGORIES_ROUTE,
  MANAGE_TAB_META,
  getCategories,
  isManageTab,
} from "@/modules/manage";
import { Link, useLocation, useParams } from "react-router-dom";
import type { ManageTab } from "@/modules/manage";

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
