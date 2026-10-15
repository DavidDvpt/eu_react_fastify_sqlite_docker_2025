import { SessionType } from "@/api/generated/model";
import { useGetCurrentSessionApiV2SessionsCurrentGet } from "@/api/generated/react-query/entropiaManagerAPI";
import { Section } from "lucide-react";

function CurrentSessionView() {
  const currentSessionQuery = useGetCurrentSessionApiV2SessionsCurrentGet(
    { type: SessionType.MINING },
    { query: { retry: false } },
  );

  const currentSession = currentSessionQuery.data;

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

export default CurrentSessionView;
