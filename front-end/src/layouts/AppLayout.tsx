import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../router/guards";

function AppLayout() {
  if (!isAuthenticated()) return <Navigate to="/auth/signin" replace />;

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default AppLayout;
