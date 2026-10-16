import { VerticalNav } from "@/shared/components";
import useNavLinks from "@/shared/hooks/useNavLinks";
import { useGetMiningSessionsApiV2SessionsMiningGet } from "@/api/generated/react-query/entropiaManagerAPI";
import { useLocation, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import MiningSessionCloseModal from "./MiningSessionCloseModal";

function MiningLeftNav() {
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const links = useNavLinks();
  const sessionsQuery = useGetMiningSessionsApiV2SessionsMiningGet();
  const hasCurrentSession = sessionsQuery.data?.some((session) => session.endedAt == null) ?? false;
  const currentSessionId = sessionsQuery.data?.find((session) => session.endedAt == null)?.sessionId;
  const isCloseModalOpen = searchParams.get("modal") === "close" && Boolean(searchParams.get("session_id"));

  return (
    <>
      <VerticalNav
        items={links.map((link) => ({
        ...link,
        key: `mining-left-nav-link-${link.key}`,
        variant: "navVertical",
        disabled:
          link.route === "/mining/current"
            ? !hasCurrentSession || location.pathname === "/mining/current"
            : link.route === "/mining/create"
              ? hasCurrentSession
              : link.disabled,
        }))}
      />
      {hasCurrentSession && (
        <Button type="button" variant="warning" className="mx-2 w-[calc(100%-1rem)] !text-[14px]" onClick={() => {
          if (!currentSessionId) return;
          setSearchParams({ session_id: currentSessionId, modal: "close" });
          setCloseModalOpen(true);
        }}>
          Clore session
        </Button>
      )}
      <MiningSessionCloseModal
        open={closeModalOpen || isCloseModalOpen}
        sessionId={searchParams.get("session_id") ?? undefined}
        onOpenChange={(open) => {
          setCloseModalOpen(open);
          if (!open) setSearchParams({});
        }}
      />
    </>
  );
}

export default MiningLeftNav;
