import { VerticalNav } from "@/shared/components";
import useNavLinks from "@/shared/hooks/useNavLinks";
import { useGetCurrentSessionApiV2SessionsCurrentGet } from "@/api/generated/react-query/entropiaManagerAPI";
import { SessionType } from "@/api/generated/react-query/model/sessionType";

function MiningLeftNav() {
  const links = useNavLinks();
  const currentSessionQuery = useGetCurrentSessionApiV2SessionsCurrentGet(
    { type: SessionType.MINING },
    { query: { retry: false } },
  );
  const hasCurrentSession = Boolean(currentSessionQuery.data);

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
