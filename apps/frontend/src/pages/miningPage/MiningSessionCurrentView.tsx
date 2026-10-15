import { SessionType } from "@/api/generated/model";
import { useGetCurrentSessionApiV2SessionsCurrentGet } from "@/api/generated/react-query/entropiaManagerAPI";
import type { MiningCurrentSessionResponse } from "@/api/generated/react-query/model/miningCurrentSessionResponse";
import { Panel, Section } from "@/shared/components/Containers";
import { NumberHelper } from "@/shared/helpers";
import { useSystemDatas } from "@/shared/hooks";
import MiningSessionCockpit from "./components/cockpit/MiningSessionCockpit";

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
  const enhancerLines = [
    ...Object.entries(miningSession?.finderEnhancers ?? {}).map(
      ([socket, enhancer]) => ({
        label: `Finder · socket ${socket}`,
        enhancer,
      }),
    ),
    ...Object.entries(miningSession?.excavatorEnhancers ?? {}).map(
      ([socket, enhancer]) => ({
        label: `Excavateur · socket ${socket}`,
        enhancer,
      }),
    ),
  ];
  const itemById = new Map((itemDatas ?? []).map((item) => [item.id, item]));

  return (
    <Panel className="grid grid-cols-3 gap-2">
      <Section className="flex min-h-0 flex-1 items-center justify-center text-text col-span-2 ">
        {currentSessionQuery.isPending ? (
          "Recherche de la session en cours..."
        ) : !miningSession ? (
          "Aucune session Mining en cours."
        ) : (
          <div className="flex w-full max-w-xl flex-col gap-3">
            <h1 className="m-0 text-lg font-semibold">
              Session Mining en cours
            </h1>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="text-text-muted">ID</span>
              <span>{miningSession.id}</span>
              <span className="text-text-muted">Clics</span>
              <span>{miningSession.clickCount ?? "—"}</span>
              <span className="text-text-muted">Type</span>
              <span>{miningSession.searchType ?? "—"}</span>
              <span className="text-text-muted">Finder</span>
              <span>{miningSession.finderItemId ?? "—"}</span>
              <span className="text-text-muted">Amplificateur</span>
              <span>{miningSession.amplifierItemId ?? "—"}</span>
              <span className="text-text-muted">Excavateurs</span>
              <span>{miningSession.excavatorItemIds?.join(", ") || "—"}</span>
              <span className="text-text-muted">Coût TT / TTC</span>
              <span>
                {NumberHelper.formatNumber(miningSession.costTt ?? 0)} /{" "}
                {NumberHelper.formatNumber(miningSession.costTtc ?? 0)}
              </span>
              <span className="text-text-muted">Résultat TT / TTC</span>
              <span>
                {NumberHelper.formatNumber(miningSession.resultTt ?? 0)} /{" "}
                {NumberHelper.formatNumber(miningSession.resultTtc ?? 0)}
              </span>
            </div>
            {enhancerLines.length > 0 && (
              <div className="flex flex-col gap-1 text-sm">
                <h2 className="m-0 text-sm font-medium">Enhancers</h2>
                {enhancerLines.map(({ label, enhancer }) => (
                  <div
                    key={`${label}-${enhancer.itemId}`}
                    className="flex justify-between gap-3"
                  >
                    <span>
                      {label} · {enhancer.itemId}
                    </span>
                    <span>{enhancer.quantityRemaining} restants</span>
                  </div>
                ))}
              </div>
            )}
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
