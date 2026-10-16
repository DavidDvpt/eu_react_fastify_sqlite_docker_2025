import { SessionType } from "@/api/generated/model";
import { useGetCurrentSessionApiV2SessionsCurrentGet } from "@/api/generated/react-query/entropiaManagerAPI";
import type { MiningCurrentSessionResponse } from "@/api/generated/react-query/model/miningCurrentSessionResponse";
import { Panel, Section } from "@/shared/components/Containers";
import { useSystemDatas } from "@/shared/hooks";
import MiningSessionCockpit from "./components/cockpit/MiningSessionCockpit";
import MiningSessionResults from "./components/cockpit/MiningSessionResults";

function MiningSessionCurrentView() {
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
  const itemById = new Map((itemDatas ?? []).map((item) => [item.id, item]));

  return (
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
  );
}

export default MiningSessionCurrentView;
