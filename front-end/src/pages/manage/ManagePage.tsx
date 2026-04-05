import { MANAGE_TAB_META, isManageTab } from "@/modules/manage";
import { Link, useLocation, useParams } from "react-router-dom";
import type { ManageTab } from "@/modules/manage";

function ManagePage() {
  const { tab, id } = useParams();
  const { pathname } = useLocation();

  const activeTab: ManageTab = isManageTab(tab) ? tab : "category";
  const meta = MANAGE_TAB_META[activeTab];

  const isCreate = pathname.endsWith("/create");
  const isEdit = pathname.endsWith("/edit") && Boolean(id);

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

      <section className="rounded-md border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
        {isCreate
          ? `Mode creation pour "${activeTab}".`
          : isEdit
            ? `Mode edition pour "${activeTab}" (id: ${id}).`
            : `Mode liste pour "${activeTab}" (table + lignes cliquables).`}
      </section>
    </div>
  );
}

export default ManagePage;
