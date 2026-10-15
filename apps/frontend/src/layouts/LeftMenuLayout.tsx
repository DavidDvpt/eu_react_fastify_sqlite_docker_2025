import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import LeftNavContentLayout from "./LeftNavContentLayout";

function LeftMenuLayout({ leftNav }: { leftNav: ReactNode }) {
  return (
    <LeftNavContentLayout leftNav={leftNav}>
      <Outlet />
    </LeftNavContentLayout>
  );
}

export default LeftMenuLayout;
