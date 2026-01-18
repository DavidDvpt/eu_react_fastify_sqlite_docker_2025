import { selectIsLoggued } from "@/modules/auth";
import { useAppSelector } from "@/store/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireAuth() {
  const isLoggued = useAppSelector(selectIsLoggued);
  const location = useLocation();

  if (!isLoggued) {
    return <Navigate to="/auth/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RequireAuth;
