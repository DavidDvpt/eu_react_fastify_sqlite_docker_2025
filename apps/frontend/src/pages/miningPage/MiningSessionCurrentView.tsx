import { SessionType } from "@/api/generated/model";
import { useGetCurrentSessionApiV2SessionsCurrentGet } from "@/api/generated/react-query/entropiaManagerAPI";
import type { MiningCurrentSessionResponse } from "@/api/generated/react-query/model/miningCurrentSessionResponse";
import { Panel, Section } from "@/shared/components/Containers";
import { useSystemDatas } from "@/shared/hooks";
import { useCallback, useEffect, useState } from "react";
import { useListDepositSizesApiV2MiningDepositSizesGet } from "@/api/generated/react-query/entropiaManagerAPI";
import MiningSessionCockpit from "./components/cockpit/MiningSessionCockpit";
import MiningSessionResults from "./components/cockpit/MiningSessionResults";
import { useMiningChatLogClaims } from "@/features/miningClaims/hooks/useMiningChatLogClaims";
import MiningClaimSnackbar, { type MiningClaimSnackbarData } from "./components/cockpit/MiningClaimSnackbar";

function MiningSessionCurrentView() {
  const [snackbarClaim, setSnackbarClaim] = useState<MiningClaimSnackbarData | null>(null);
  const depositSizesQuery = useListDepositSizesApiV2MiningDepositSizesGet();
  const currentSessionQuery = useGetCurrentSessionApiV2SessionsCurrentGet(
    { type: SessionType.MINING },
    { query: { retry: false } },
  );
  const {
    items: { itemDatas },
  } = useSystemDatas();

  const currentSession = currentSessionQuery.data;
  const miningSession =
    currentSession && "finderItemId" in currentSession
      ? (currentSession as MiningCurrentSessionResponse)
      : undefined;
  const handleClaimDetected = useCallback((claim: { resourceName: string }) => {
    setSnackbarClaim({ type: "detected", resourceName: claim.resourceName });
  }, []);
  const handleClaimDepleted = useCallback((claim: { resourceName: string; value: number; isGlobal: boolean; isHof: boolean; isAth: boolean; depositSize: number | null }) => {
    const depositSize = depositSizesQuery.data?.find((size) => size.size === claim.depositSize);
    setSnackbarClaim({
      type: "depleted",
      resourceName: claim.resourceName,
      romanSize: depositSize?.romanSize ?? "",
      value: claim.value,
      isGlobal: claim.isGlobal,
      isHof: claim.isHof,
      isAth: claim.isAth,
    });
  }, [depositSizesQuery.data]);
  useMiningChatLogClaims(miningSession?.id, itemDatas ?? [], handleClaimDetected, handleClaimDepleted);
  useEffect(() => {
    if (!snackbarClaim) return;
    const timeout = window.setTimeout(() => setSnackbarClaim(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [snackbarClaim]);
  const itemById = new Map((itemDatas ?? []).map((item) => [item.id, item]));

  return (
    <>
      {snackbarClaim && <MiningClaimSnackbar claim={snackbarClaim} />}
    <Panel className="grid grid-cols-3 gap-2">
      <Section className="col-span-2 flex min-h-0 flex-1 items-start justify-start text-text">
        {currentSessionQuery.isPending ? (
          "Recherche de la session en cours..."
        ) : !miningSession ? (
          "Aucune session Mining en cours."
        ) : (
          <div className="flex w-full max-w-2xl flex-col">
            <MiningSessionResults
              sessionId={miningSession.id}
              items={itemDatas ?? []}
              searchType={miningSession.searchType}
              resultLines={miningSession.resultLines}
            />
          </div>
        )}
      </Section>

      <Section className="col-span-1 min-h-0">
        {miningSession && (
          <MiningSessionCockpit
            session={miningSession}
            itemById={itemById}
          />
        )}
      </Section>
    </Panel>
    </>
  );
}

export default MiningSessionCurrentView;
