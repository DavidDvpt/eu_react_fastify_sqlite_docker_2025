import { useState } from 'react';
import type { MiningCurrentSessionResponse } from '@/api/generated/react-query/model/miningCurrentSessionResponse';
import type { ItemViewModel } from '@zod-schemas';
import EquipmentSummaryComponent from './EquipmentSummary';
import MiningSessionFinancialSummary from './MiningSessionFinancialSummary';
import MiningSessionClaims from './MiningSessionClaims';
import type { EnhancerLine } from './types';

function MiningSessionCockpit({
  session,
  itemById,
  resourceNames,
}: {
  session: MiningCurrentSessionResponse;
  itemById: Map<string, ItemViewModel>;
  resourceNames: Record<string, string>;
}) {
  const [tab, setTab] = useState<'setup' | 'claims'>('setup');
  const toEnhancerLines = (
    enhancers: MiningCurrentSessionResponse['finderEnhancers'],
  ): EnhancerLine[] =>
    Object.entries(enhancers ?? {})
      .map(([socket, enhancer]) => {
        const costLine = session.costLines?.find(
          (line) => line.isEnhancer && line.itemId === enhancer.itemId,
        );
        const quantityInitial = enhancer.quantityInitial;
        const quantityConsumed =
          costLine?.quantity ??
          Math.max(0, quantityInitial - enhancer.quantityRemaining);
        return {
          itemId: enhancer.itemId,
          socket,
          quantityInitial,
          quantityConsumed,
          quantityRemaining: Math.max(0, quantityInitial - quantityConsumed),
          costLineId:
            costLine?.id ??
            (enhancer as { lineId?: string; costLineId?: string }).lineId ??
            (enhancer as { costLineId?: string }).costLineId,
        };
      })
      .sort((left, right) => Number(left.socket) - Number(right.socket));
  const finderEnhancers = toEnhancerLines(session.finderEnhancers);
  const excavatorEnhancers = toEnhancerLines(session.excavatorEnhancers);

  const miningType =
    session.searchType === 1
      ? 'Enmatter'
      : session.searchType === 2
        ? 'Ore'
        : session.searchType === 3
          ? 'Enmatter/Ore'
          : '—';

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
      <div>
        <h2 className="m-0 text-lg font-semibold text-text">
          Cockpit de session
        </h2>
        <p className="m-0 text-xs text-text-muted">
          Résumé et suivi en temps réel
        </p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium text-text">
          {session.clickCount ?? '—'} clics
        </span>
        <span className="font-medium text-text">{miningType}</span>
      </div>
      <div className="flex gap-1 border-b border-border">
        {(
          [
            ['setup', 'Setup'],
            ['claims', 'Claims'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`rounded-t-md border border-b-0 bg-transparent px-3 py-2 text-sm text-white transition-colors hover:bg-white/10 ${tab === value ? 'border-border bg-primary/20 font-bold text-white' : 'border-transparent text-white/70'}`}
            onClick={() => setTab(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === 'claims' ? (
        <MiningSessionClaims
          sessionId={session.id}
          resourceNames={resourceNames}
          items={Array.from(itemById.values())}
          searchType={session.searchType}
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default MiningSessionCockpit;
