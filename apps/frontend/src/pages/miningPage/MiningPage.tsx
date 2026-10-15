import { useLocation, useNavigate } from "react-router-dom";
import { useGetMiningSessionsApiV2SessionsMiningGet } from "@/api/generated/react-query/entropiaManagerAPI";
import { GenericList } from "@/shared/components/GenericList";
import { getGridTemplateColumns } from "@/shared/components/GenericList/gridTemplate";
import { Section } from "@/shared/components/Containers";
import MiningSessionModal from "./components/MiningSessionModal";
import CurrentSessionView from "@/pages/miningPage/CurrentSessionView";
import miningSessionColumns from "@/shared/components/GenericList/columnDefinition/miningSessionTemplateColumns";
import type { MiningSessionTableRow } from "@/shared/types/mining";

const miningSessionColumnsTemplate =
  getGridTemplateColumns(miningSessionColumns);

function MiningPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isCreateRoute = location.pathname === "/mining/create";
  const isCurrentRoute = location.pathname === "/mining/current";
  const isSessionRoute = location.pathname.endsWith("/session");
  const sessionsQuery = useGetMiningSessionsApiV2SessionsMiningGet();

  const sessionRows: MiningSessionTableRow[] = (sessionsQuery.data ?? []).map(
    (session, index) => ({
      ...session,
      index: index + 1,
    }),
  );

  if (isCurrentRoute || isSessionRoute) {
    return <CurrentSessionView />;
  }

  return (
    <>
      <Section className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto text-text">
        <h1 className="m-0 text-lg font-semibold">Sessions Mining</h1>
        <div className="w-full min-w-0 overflow-hidden">
          <div
            className="grid items-center border-b border-border bg-surface-hover text-center text-xs font-semibold text-text"
            style={{ gridTemplateColumns: miningSessionColumnsTemplate }}
          >
            <span className="row-span-2 px-1">#</span>
            <span className="row-span-2 px-1 text-right">Clics</span>
            <span className="row-span-2 px-1">Type</span>
            <span className="row-span-2 px-1">Finder</span>
            <span className="row-span-2 px-1">Amp</span>
            <span className="col-span-3 border-l border-border px-1 py-1 text-center">
              Coût
            </span>
            <span className="col-span-3 border-l border-border px-1 py-1 text-center">
              Résultat
            </span>
            <span className="col-span-3 border-l border-border px-1 py-1 text-center">
              Bilan
            </span>
            <span className="border-l border-border px-1 py-1 text-right">
              TT
            </span>
            <span className="px-1 py-1 text-right">TTC</span>
            <span className="px-1 py-1 text-right">%</span>
            <span className="border-l border-border px-1 py-1 text-right">
              TT
            </span>
            <span className="px-1 py-1 text-right">TTC</span>
            <span className="px-1 py-1 text-right">%</span>
            <span className="border-l border-border px-1 py-1 text-right">
              TT
            </span>
            <span className="px-1 py-1 text-right">TTC</span>
            <span className="px-1 py-1 text-right">%</span>
          </div>
          <GenericList
            columns={miningSessionColumns}
            rows={sessionRows}
            getRowKey={(row) => `${row.number}-${row.index}`}
            grow={false}
            className="min-h-0 w-full"
            bodyClassName="overflow-y-auto"
            emptyMessage="Aucune session Mining."
            isLoading={sessionsQuery.isPending}
            isError={sessionsQuery.isError}
            errorMessage="Impossible de charger les sessions."
            rowBaseClassName="grid items-stretch text-xs text-text"
            rowClassName={(row) =>
              row.endedAt == null
                ? "border-b border-border bg-white !text-black [&_*]:!text-black"
                : "border-b border-border"
            }
            onRowClick={(row) =>
              navigate(row.endedAt == null ? "/mining/current" : `/mining/${row.number}/session`)
            }
            rowHeight={32}
          />
        </div>
      </Section>
      {isCreateRoute && <MiningSessionModal />}
    </>
  );
}

export default MiningPage;
