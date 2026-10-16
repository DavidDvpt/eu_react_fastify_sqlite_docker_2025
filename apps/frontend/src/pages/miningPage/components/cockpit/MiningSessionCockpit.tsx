import type { MiningCurrentSessionResponse } from "@/api/generated/react-query/model/miningCurrentSessionResponse";
import type { ItemViewModel } from "@zod-schemas";
import EquipmentSummaryComponent from "./EquipmentSummary";
import MiningSessionFinancialSummary from "./MiningSessionFinancialSummary";
import type { EnhancerLine } from "./types";

function MiningSessionCockpit({
  session,
  itemById,
}: {
  session: MiningCurrentSessionResponse;
  itemById: Map<string, ItemViewModel>;
}) {
  const toEnhancerLines = (
    enhancers: MiningCurrentSessionResponse["finderEnhancers"],
  ): EnhancerLine[] =>
    Object.entries(enhancers ?? {})
      .map(([socket, enhancer]) => ({
        itemId: enhancer.itemId,
        socket,
        quantityRemaining: enhancer.quantityRemaining,
        costLineId: (enhancer as { lineId?: string; costLineId?: string }).lineId ??
          (enhancer as { costLineId?: string }).costLineId,
      }))
      .sort((left, right) => Number(left.socket) - Number(right.socket));
  const finderEnhancers = toEnhancerLines(session.finderEnhancers);
  const excavatorEnhancers = toEnhancerLines(session.excavatorEnhancers);

  const miningType =
    session.searchType === 1
      ? "Enmatter"
      : session.searchType === 2
        ? "Ore"
        : session.searchType === 3
          ? "Enmatter/Ore"
          : "—";

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
      <div>
        <h2 className="m-0 text-lg font-semibold text-text">Cockpit de session</h2>
        <p className="m-0 text-xs text-text-muted">Résumé et suivi en temps réel</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium text-text">
          {session.clickCount ?? "—"} clics
        </span>
        <span className="font-medium text-text">{miningType}</span>
      </div>
      <EquipmentSummaryComponent
        label="Finder"
        itemId={session.finderItemId}
        tierLevel={session.finderLot?.tierLevel}
        itemById={itemById}
        amplifierItemId={session.amplifierItemId}
        enhancers={finderEnhancers}
        sessionId={session.id}
      />
      <EquipmentSummaryComponent
        label="Excavateur"
        itemId={session.excavatorItemIds?.[0]}
        tierLevel={session.excavatorLots?.[0]?.tierLevel}
        itemById={itemById}
        enhancers={excavatorEnhancers}
        sessionId={session.id}
      />
      <MiningSessionFinancialSummary session={session} />
    </div>
  );
}

export default MiningSessionCockpit;
