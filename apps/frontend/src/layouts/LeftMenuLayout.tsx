import { Outlet } from "react-router-dom";
import LeftNavContentLayout from "./LeftNavContentLayout";

function LeftMenuLayout() {
  return (
    <LeftNavContentLayout>
      <Outlet />
    </LeftNavContentLayout>
  );
}

export default LeftMenuLayout;
