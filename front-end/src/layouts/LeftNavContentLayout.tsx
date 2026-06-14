import type { PropsWithChildren } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { VerticalNav } from "@/shared/components";

import { Panel } from "@/shared/components/Containers";

import useNavLinks from "@/shared/hooks/useNavLinks";
import {
  getManageCreateLabel,
  isManageTab,
} from "@/pages/managePage/manageLeftNav";

function LeftNavContentLayout({ children }: PropsWithChildren) {
  const links = useNavLinks();
  const navigate = useNavigate();
  const { tab } = useParams();

  const selectedTab = isManageTab(tab) ? tab : "category";
  const createLabel = getManageCreateLabel(selectedTab);

  return (
    <div className="h-full min-h-0 p-2">
      <Panel className="grid h-full min-h-0 grid-cols-[220px_minmax(0,1fr)] gap-2 overflow-hidden m-0">
        <div className="flex h-full min-h-0 flex-col">
          <VerticalNav
            items={links.map((link) => ({
              key: `left-nav-link-${link.key}`,
              content: link.content,
              route: link.route,
              variant: "navVertical",
            }))}
          />

          <div className="mt-auto">
            <Button
              variant="primary"
              size="nav"
              className="w-full"
              onClick={() => navigate(`/manage/${selectedTab}/create`)}
            >
              {createLabel}
            </Button>
          </div>
        </div>

        {children}
      </Panel>
    </div>
  );
}

export default LeftNavContentLayout;
