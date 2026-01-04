import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../router/guards";

function AppLayout() {
  if (!isAuthenticated()) return <Navigate to="/auth/login" replace />;

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default AppLayout;
