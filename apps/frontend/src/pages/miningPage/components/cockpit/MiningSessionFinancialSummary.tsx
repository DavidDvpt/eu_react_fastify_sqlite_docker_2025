import type { MiningCurrentSessionResponse } from "@/api/generated/react-query/model/miningCurrentSessionResponse";
import { NumberHelper } from "@/shared/helpers";

function formatReturn(cost: number, result: number) {
  return cost > 0 ? `${NumberHelper.formatPercent((result / cost) * 100)} %` : "—";
}

function MiningSessionFinancialSummary({
  session,
}: {
  session: MiningCurrentSessionResponse;
}) {
  const costTt = session.costTt ?? 0;
  const costTtc = session.costTtc ?? 0;
  const resultTt = session.resultTt ?? 0;
  const resultTtc = session.resultTtc ?? 0;

  return (
    <section className="flex flex-col gap-3 rounded-md border border-border p-3">
      <h3 className="m-0 text-sm font-semibold text-text">Bilan de session</h3>
      <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-x-3 gap-y-2 text-xs">
        <span />
        <span className="text-right text-text-muted">Coût</span>
        <span className="text-right text-text-muted">Résultat</span>
        <span className="text-text-muted">TT</span>
        <span className="text-right text-text">{NumberHelper.formatNumber(costTt)}</span>
        <span className="text-right text-text">{NumberHelper.formatNumber(resultTt)}</span>
        <span className="text-text-muted">TTC</span>
        <span className="text-right text-text">{NumberHelper.formatNumber(costTtc)}</span>
        <span className="text-right text-text">{NumberHelper.formatNumber(resultTtc)}</span>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-2 text-xs">
        <span className="text-text-muted">Bilan TT</span>
        <span className="text-right text-text">
          {formatReturn(costTt, resultTt)}
        </span>
        <span className="text-text-muted">Bilan TTC</span>
        <span className="text-right text-text">
          {formatReturn(costTtc, resultTtc)}
        </span>
      </div>
    </section>
  );
}

export default MiningSessionFinancialSummary;
