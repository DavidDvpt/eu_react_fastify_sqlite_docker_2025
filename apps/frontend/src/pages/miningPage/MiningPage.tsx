import { useLocation, useParams } from "react-router-dom";
import {
  useGetCurrentSessionApiV2SessionsCurrentGet,
  useGetMiningSessionsApiV2SessionsMiningGet,
} from "@/api/generated/react-query/entropiaManagerAPI";
import { SessionType } from "@/api/generated/react-query/model/sessionType";
import type { MiningSessionHistoryResponse } from "@/api/generated/react-query/model/miningSessionHistoryResponse";
import { GenericList } from "@/shared/components/GenericList";
import type { GenericListColumn } from "@/shared/types";
import { getGridTemplateColumns } from "@/shared/components/GenericList/gridTemplate";
import { Section } from "@/shared/components/Containers";
import MiningSessionModal from "./components/MiningSessionModal";

type MiningSessionTableRow = MiningSessionHistoryResponse & { index: number; endedAt?: string | null };

const formatNumber = (value: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 3 }).format(value);
const formatPercent = (value: number) => new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

const miningSessionColumns: GenericListColumn<MiningSessionTableRow>[] = [
  { key: "index", label: "#", minWidth: 36, align: "center", value: (row) => row.index },
  { key: "clickCount", label: "Clics", minWidth: 44, align: "right", value: (row) => row.clickCount ?? "—" },
  { key: "type", label: "Type", minWidth: 52, align: "center", value: (row) => row.searchType ?? "—" },
  { key: "finder", label: "Finder", minWidth: 180, fillRemainingSpace: true, value: (row) => row.finder ?? "—" },
  { key: "amp", label: "Amp", minWidth: 52, align: "center", value: (row) => row.amp ? "Oui" : "Non" },
  { key: "costTt", label: "Coût TT", minWidth: 64, align: "right", value: (row) => formatNumber(row.costTt) },
  { key: "costTtc", label: "Coût TTC", minWidth: 64, align: "right", value: (row) => formatNumber(row.costTtc) },
  { key: "costBalance", label: "Bilan TT", minWidth: 64, align: "right", value: (row) => `${formatPercent(row.costTt ? row.costTtc / row.costTt * 100 : 0)}%` },
  { key: "resultTt", label: "Résultat TT", minWidth: 64, align: "right", value: (row) => formatNumber(row.resultTt) },
  { key: "resultTtc", label: "Résultat TTC", minWidth: 64, align: "right", value: (row) => formatNumber(row.resultTtc) },
  { key: "resultBalance", label: "Bilan TTC", minWidth: 64, align: "right", value: (row) => `${formatPercent(row.resultTt ? row.resultTtc / row.resultTt * 100 : 0)}%` },
  { key: "balanceTt", label: "Bilan TT", minWidth: 76, align: "right", value: (row) => formatNumber(row.resultTt - row.costTt) },
  { key: "balanceTtc", label: "Bilan TTC", minWidth: 76, align: "right", value: (row) => formatNumber(row.resultTtc - row.costTtc) },
  { key: "balancePercent", label: "Bilan %", minWidth: 72, align: "right", value: (row) => `${formatPercent(row.resultTtc > 0 && row.costTtc ? row.resultTtc / row.costTtc * 100 : 0)}%` },
];

const miningSessionColumnsTemplate = getGridTemplateColumns(miningSessionColumns);

function MiningPage() {
  const location = useLocation();
  const { id } = useParams();
  const isCreateRoute = location.pathname === "/mining/create";
  const isCurrentRoute = location.pathname === "/mining/current";
  const isSessionRoute = Boolean(id);
  const currentSessionQuery = useGetCurrentSessionApiV2SessionsCurrentGet(
    { type: SessionType.MINING },
    { query: { retry: false } },
  );
  const sessionsQuery = useGetMiningSessionsApiV2SessionsMiningGet();

  const currentSession = currentSessionQuery.data;
  const sessionRows: MiningSessionTableRow[] = (sessionsQuery.data ?? []).map((session, index) => ({
    ...session,
    endedAt: (session as MiningSessionHistoryResponse & { endedAt?: string | null }).endedAt,
    index: index + 1,
  }));

  if (isSessionRoute) {
    return (
      <Section className="flex min-h-0 flex-1 items-center justify-center text-center text-text">
        Session Mining {id}
      </Section>
    );
  }

  if (isCurrentRoute) {
    return (
      <Section className="flex min-h-0 flex-1 items-center justify-center text-center text-text">
        {currentSessionQuery.isPending
          ? "Recherche de la session en cours..."
          : currentSession
            ? `Session Mining en cours : ${currentSession.id}`
            : "Aucune session Mining en cours."}
      </Section>
    );
  }

  return (
    <>
      <Section className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto text-text">
        <h1 className="m-0 text-lg font-semibold">Sessions Mining</h1>
        <div className="w-full min-w-0 overflow-hidden">
          <div className="grid items-center border-b border-border bg-surface-hover text-center text-xs font-semibold text-text" style={{ gridTemplateColumns: miningSessionColumnsTemplate }}>
            <span className="row-span-2 px-1">#</span>
            <span className="row-span-2 px-1 text-right">Clics</span>
            <span className="row-span-2 px-1">Type</span>
            <span className="row-span-2 px-1">Finder</span>
            <span className="row-span-2 px-1">Amp</span>
            <span className="col-span-3 border-l border-border px-1 py-1 text-center">Coût</span>
            <span className="col-span-3 border-l border-border px-1 py-1 text-center">Résultat</span>
            <span className="col-span-3 border-l border-border px-1 py-1 text-center">Bilan</span>
            <span className="border-l border-border px-1 py-1 text-right">TT</span>
            <span className="px-1 py-1 text-right">TTC</span>
            <span className="px-1 py-1 text-right">%</span>
            <span className="border-l border-border px-1 py-1 text-right">TT</span>
            <span className="px-1 py-1 text-right">TTC</span>
            <span className="px-1 py-1 text-right">%</span>
            <span className="border-l border-border px-1 py-1 text-right">TT</span>
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
            rowClassName={(row) => row.endedAt == null
              ? "border-b border-border bg-white !text-black [&_*]:!text-black"
              : "border-b border-border"}
            rowHeight={32}
          />
        </div>
      </Section>
      {isCreateRoute && <MiningSessionModal />}
    </>
  );
}

export default MiningPage;
