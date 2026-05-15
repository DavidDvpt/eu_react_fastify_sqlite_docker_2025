import type { PropsWithChildren } from "react";
import { VerticalNav } from "@/shared/components";

import { Panel } from "@/shared/components/Containers";

import useNavLinks from "@/shared/hooks/useNavLinks";

function LeftNavContentLayout({ children }: PropsWithChildren) {
  const links = useNavLinks();

  return (
    <Panel className="grid grid-cols-[220px_minmax(0,1fr)] gap-2">
      <VerticalNav
        items={links.map((link) => ({
          key: `left-nav-link-${link.key}`,
          content: link.content,
          route: link.route,
          variant: "navVertical",
        }))}
      />

      {children}
    </Panel>
  );
}

export default LeftNavContentLayout;
