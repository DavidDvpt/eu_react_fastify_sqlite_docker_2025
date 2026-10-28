import { SessionType } from '@/api/generated/model';
import { useGetCurrentSessionApiV2SessionsCurrentGet } from '@/api/generated/react-query/entropiaManagerAPI';
import type { MiningCurrentSessionResponse } from '@/api/generated/react-query/model/miningCurrentSessionResponse';
import { Panel, Section } from '@/shared/components/Containers';
import { useSystemDatas } from '@/shared/hooks';
import { useCallback, useEffect, useState } from 'react';
import MiningSessionCockpit from './components/cockpit/MiningSessionCockpit';
import MiningSessionResults from './components/cockpit/MiningSessionResults';
import {
  useMiningChatLogClaims,
  type ClaimDepletedInfo,
  type ResultLineUpdate,
  type UnknownClaimCandidate,
} from '@/features/miningClaims/hooks/useMiningChatLogClaims';
import MiningClaimSnackbar, {
  type MiningClaimSnackbarData,
} from './components/cockpit/MiningClaimSnackbar';

function MiningSessionCurrentView() {
  const [snackbarClaim, setSnackbarClaim] =
    useState<MiningClaimSnackbarData | null>(null);
  const [resourceNames, setResourceNames] = useState<Record<string, string>>(
    {},
  );
  const [resultLineUpdates, setResultLineUpdates] = useState<
    Record<string, ResultLineUpdate>
  >({});
  const [unknownClaimDialog, setUnknownClaimDialog] = useState<{
    candidates: UnknownClaimCandidate[];
    resolve: (claimId: string) => void;
  } | null>(null);
  const currentSessionQuery = useGetCurrentSessionApiV2SessionsCurrentGet(
    { type: SessionType.MINING },
    { query: { retry: false } },
  );
  const {
    items: { itemDatas },
  } = useSystemDatas();

  const currentSession = currentSessionQuery.data;
  const miningSession =
    currentSession && 'finderItemId' in currentSession
      ? (currentSession as MiningCurrentSessionResponse)
      : undefined;
  const handleClaimDetected = useCallback(
    (claim: { id: string; resourceName: string }) => {
      setResourceNames((current) => ({
        ...current,
        [claim.id]: claim.resourceName,
      }));
      setSnackbarClaim({ type: 'detected', resourceName: claim.resourceName });
    },
    [],
  );
  const handleClaimDepleted = useCallback(
    (claim: ClaimDepletedInfo) => {
      setResourceNames((current) => ({
        ...current,
        [claim.id]: claim.resourceName,
      }));
      setSnackbarClaim({
        type: 'depleted',
        resourceName: claim.resourceName,
        romanSize: claim.depositSize?.romanSize ?? '',
        value: claim.value === null ? undefined : Number(claim.value),
        isGlobal: claim.isGlobal,
        isHof: claim.isHof,
        isAth: false,
      });
    },
    [],
  );
  const handleUnknownClaim = useCallback(
    (
      candidates: UnknownClaimCandidate[],
      resolve: (claimId: string) => void,
    ) => {
      setUnknownClaimDialog({ candidates, resolve });
    },
    [],
  );
  const handleResultLineChanged = useCallback((line: ResultLineUpdate) => {
    setResultLineUpdates((current) => ({ ...current, [line.id]: line }));
  }, []);
  const displayedResultLines = [
    ...(miningSession?.resultLines ?? []).map((line) => {
      const update = resultLineUpdates[String(line.id)];
      return update ? { ...line, ...update } : line;
    }),
    ...Object.values(resultLineUpdates).filter(
      (update) =>
        !(miningSession?.resultLines ?? []).some(
          (line) => line.id === update.id,
        ),
    ),
  ];
  useMiningChatLogClaims(
    miningSession?.id,
    itemDatas ?? [],
    miningSession?.resultLines ?? [],
    handleClaimDetected,
    handleClaimDepleted,
    handleUnknownClaim,
    handleResultLineChanged,
  );
  useEffect(() => {
    if (!snackbarClaim) return;
    const timeout = window.setTimeout(() => setSnackbarClaim(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [snackbarClaim]);
  const itemById = new Map((itemDatas ?? []).map((item) => [item.id, item]));

  return (
    <>
      {unknownClaimDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-surface p-5 text-text shadow-xl">
            <h2 className="m-0 text-lg font-semibold">
              Quelle source est depleted ?
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Sélectionne le claim correspondant à la source inconnue.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {unknownClaimDialog.candidates.map((candidate, index) => (
                <button
                  key={candidate.id}
                  type="button"
                  className="rounded-md border border-border bg-surface-hover px-3 py-2 text-left text-sm hover:border-primary"
                  onClick={() => {
                    unknownClaimDialog.resolve(candidate.id);
                    setUnknownClaimDialog(null);
                  }}
                >
                  Claim {index + 1} — {candidate.resourceName}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {snackbarClaim && <MiningClaimSnackbar claim={snackbarClaim} />}
      <Panel className="grid grid-cols-3 gap-2">
        <Section className="col-span-2 flex min-h-0 flex-1 items-start justify-start text-text">
          {currentSessionQuery.isPending ? (
            'Recherche de la session en cours...'
          ) : !miningSession ? (
            'Aucune session Mining en cours.'
          ) : (
            <div className="flex w-full max-w-2xl flex-col">
              <MiningSessionResults
                sessionId={miningSession.id}
                items={itemDatas ?? []}
                searchType={miningSession.searchType}
                resultLines={displayedResultLines}
              />
            </div>
          )}
        </Section>

        <Section className="col-span-1 min-h-0">
          {miningSession && (
            <MiningSessionCockpit
              session={miningSession}
              itemById={itemById}
              resourceNames={resourceNames}
            />
          )}
        </Section>
      </Panel>
    </>
  );
}

export default MiningSessionCurrentView;
