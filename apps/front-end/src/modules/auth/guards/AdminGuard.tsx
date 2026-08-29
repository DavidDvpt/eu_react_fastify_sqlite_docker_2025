import { selectIsAdmin } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { Navigate, Outlet } from "react-router-dom";

function AdminGuard() {
  const role = useAppSelector(selectIsAdmin);

  if (role !== "ADMIN") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default AdminGuard;
