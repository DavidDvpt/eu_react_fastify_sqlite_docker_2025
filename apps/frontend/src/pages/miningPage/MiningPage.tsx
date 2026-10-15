import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useGetCurrentSessionApiV2SessionsCurrentGet,
} from "@/api/generated/react-query/entropiaManagerAPI";
import { SessionType } from "@/api/generated/react-query/model/sessionType";
import { Section } from "@/shared/components/Containers";
import MiningSessionModal from "./components/MiningSessionModal";

function MiningPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isCreateRoute = location.pathname === "/mining/create";
  const isSessionRoute = Boolean(id);
  const currentSessionQuery = useGetCurrentSessionApiV2SessionsCurrentGet(
    { type: SessionType.MINING },
    { query: { retry: false } },
  );

  const currentSession = currentSessionQuery.data;

  useEffect(() => {
    if (!currentSession || isCreateRoute || isSessionRoute) return;

    navigate(`/mining/${currentSession.id}/session`, { replace: true });
  }, [currentSession, isCreateRoute, isSessionRoute, navigate]);

  if (isSessionRoute) {
    return (
      <Section className="flex min-h-0 flex-1 items-center justify-center text-center text-text">
        Session Mining {id}
      </Section>
    );
  }

  return (
    <>
      <Section className="flex min-h-0 flex-1 items-center justify-center text-center text-text">
        {currentSessionQuery.isPending
          ? "Recherche d’une session Mining..."
          : "Aucune session Mining."}
      </Section>
      {isCreateRoute && <MiningSessionModal />}
    </>
  );
}

export default MiningPage;
