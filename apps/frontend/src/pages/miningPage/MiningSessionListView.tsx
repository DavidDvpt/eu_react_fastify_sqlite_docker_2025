import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useGetMiningSessionsApiV2SessionsMiningGet } from "@/api/generated/react-query/entropiaManagerAPI";
import { GenericList } from "@/shared/components/GenericList";
import { getGridTemplateColumns } from "@/shared/components/GenericList/gridTemplate";
import { Section } from "@/shared/components/Containers";
import miningSessionColumns from "@/shared/components/GenericList/columnDefinition/miningSessionTemplateColumns";
import type { MiningSessionTableRow } from "@/shared/types/mining";
import MiningSessionCloseModal from "./components/MiningSessionCloseModal";
import { NumberHelper } from "@/shared/helpers";

const miningSessionColumnsTemplate =
  getGridTemplateColumns(miningSessionColumns);

function MiningSessionListView() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSessionId = searchParams.get("session_id");
  const sessionsQuery = useGetMiningSessionsApiV2SessionsMiningGet({
    query: { refetchOnMount: "always" },
  });
  const sessionRows: MiningSessionTableRow[] = (sessionsQuery.data ?? []).map(
    (session, index) => ({
      ...session,
      index: index + 1,
    }),
  );
  const totalBalanceTt = sessionRows.reduce(
    (total, row) => total + row.resultTt - row.costTt,
    0,
  );
  const totalBalanceTtc = sessionRows.reduce(
    (total, row) => total + row.resultTtc - row.costTtc,
    0,
  );
  const totalCostTtc = sessionRows.reduce((total, row) => total + row.costTtc, 0);
  const totalResultTtc = sessionRows.reduce((total, row) => total + row.resultTtc, 0);
  const totalBalancePercent = totalCostTtc
    ? (totalResultTtc / totalCostTtc) * 100
    : 0;
  const balanceClassName = (value: number) =>
    value < 0
      ? "text-error-500"
      : value > 0
        ? "text-success-700"
        : "text-text";

  return (
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
          footer={
            <div
              className="grid items-center text-xs font-bold"
              style={{ gridTemplateColumns: miningSessionColumnsTemplate, fontWeight: 700 }}
            >
              <span className="col-span-11 justify-self-end bg-transparent text-right font-bold text-text">Bilan</span>
              <span className={`${balanceClassName(totalBalanceTt)} bg-transparent text-right font-bold`}>
                {NumberHelper.formatNumber(totalBalanceTt)}
              </span>
              <span className={`${balanceClassName(totalBalanceTtc)} bg-transparent text-right font-bold`}>
                {NumberHelper.formatNumber(totalBalanceTtc)}
              </span>
              <span className={`${totalBalancePercent < 100 ? "text-error-500" : "text-success-700"} bg-transparent text-right font-bold`}>
                {NumberHelper.formatPercent(totalBalancePercent)}%
              </span>
            </div>
          }
          rowBaseClassName="grid items-stretch text-xs text-text"
          rowClassName={(row) => {
            if (row.endedAt == null) {
              return "border-b border-border bg-white !text-black [&_*]:!text-black";
            }
            const balanceTtc = row.resultTtc - row.costTtc;
            if (balanceTtc < 0) {
              return "border-b border-border bg-error-100 !text-black [&_*]:!text-black";
            }
            if (balanceTtc > 0) {
              return "border-b border-border bg-success-100 !text-black [&_*]:!text-black";
            }
            return "border-b border-border";
          }}
          onRowClick={(row) =>
            row.endedAt == null
              ? navigate("/mining/current")
              : setSearchParams({ session_id: row.sessionId, modal: "detail" })
          }
          rowHeight={32}
        />
      </div>
      <MiningSessionCloseModal
        open={searchParams.get("modal") === "detail" && Boolean(selectedSessionId)}
        sessionId={selectedSessionId ?? undefined}
        readOnly
        onOpenChange={(open) => {
          if (!open) setSearchParams({});
        }}
      />
    </Section>
  );
}

export default MiningSessionListView;
