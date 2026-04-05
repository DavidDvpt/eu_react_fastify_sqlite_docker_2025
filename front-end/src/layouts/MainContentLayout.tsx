import { MANAGE_NAV_LINKS } from "@/modules/manage";
import { Outlet } from "react-router-dom";
import LeftNavContentLayout from "./LeftNavContentLayout";

function MainContentLayout() {
  return (
    <LeftNavContentLayout sectionLabel="Manage" links={[...MANAGE_NAV_LINKS]}>
      <div className="h-full min-h-0">
        <Outlet />
      </div>
    </LeftNavContentLayout>
  );
}

export default MainContentLayout;
