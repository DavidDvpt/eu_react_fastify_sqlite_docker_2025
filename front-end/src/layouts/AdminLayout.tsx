import { Navigate, Outlet } from "react-router-dom";
import { isAdmin } from "../router/guards";

function AdminLayout() {
  if (isAdmin()) return <Navigate to="/" replace />;

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default AdminLayout;
