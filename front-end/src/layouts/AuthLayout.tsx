import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../router/guards";

function AuthLayout() {
  if (isAuthenticated()) return <Navigate to="/" replace />;

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
