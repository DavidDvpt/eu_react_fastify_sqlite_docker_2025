import { useLocation, useParams } from "react-router-dom";
import {
  useGetCurrentSessionApiV2SessionsCurrentGet,
  useGetMiningSessionsApiV2SessionsMiningGet,
} from "@/api/generated/react-query/entropiaManagerAPI";
import { SessionType } from "@/api/generated/react-query/model/sessionType";
import { Section } from "@/shared/components/Containers";
import MiningSessionModal from "./components/MiningSessionModal";

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
        {sessionsQuery.isPending && <p className="m-0 text-text-muted">Chargement des sessions...</p>}
        {sessionsQuery.isError && <p className="m-0 text-error-300">Impossible de charger les sessions.</p>}
        {!sessionsQuery.isPending && !sessionsQuery.isError && !sessionsQuery.data?.length && (
          <p className="m-0 text-text-muted">Aucune session Mining.</p>
        )}
        {sessionsQuery.data?.map((session) => (
          <div key={session.number} className="rounded-md border border-border p-3">
            <div className="flex flex-wrap justify-between gap-2">
              <span className="font-medium">Session #{session.number}</span>
              <span className="text-text-muted">{session.clickCount ?? 0} clics</span>
            </div>
            <div className="mt-2 grid gap-1 text-sm text-text-muted sm:grid-cols-2">
              <span>Type : {session.searchType ?? "—"}</span>
              <span>Finder : {session.finder ?? "—"}</span>
              <span>Amplificateur : {session.amp ? "Oui" : "Non"}</span>
              <span>Enhancer : {session.enhancer ? "Oui" : "Non"}</span>
              <span>Coût TT : {session.costTt} PED</span>
              <span>Coût TTC : {session.costTtc} PED</span>
            </div>
          </div>
        ))}
      </Section>
      {isCreateRoute && <MiningSessionModal />}
    </>
  );
}

export default MiningPage;
