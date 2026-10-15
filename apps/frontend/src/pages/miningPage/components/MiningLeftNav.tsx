import { VerticalNav } from "@/shared/components";
import useNavLinks from "@/shared/hooks/useNavLinks";
import { useGetMiningSessionsApiV2SessionsMiningGet } from "@/api/generated/react-query/entropiaManagerAPI";

function MiningLeftNav() {
  const links = useNavLinks();
  const sessionsQuery = useGetMiningSessionsApiV2SessionsMiningGet();
  const hasCurrentSession = sessionsQuery.data?.some((session) => session.endedAt == null) ?? false;

  return (
    <VerticalNav
      items={links.map((link) => ({
        ...link,
        key: `mining-left-nav-link-${link.key}`,
        variant: "navVertical",
        disabled: link.route === "/mining/create" ? hasCurrentSession : link.disabled,
      }))}
    />
  );
}

export default MiningLeftNav;
