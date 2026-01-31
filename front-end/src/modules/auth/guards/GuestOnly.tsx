import { selectIsLoggued } from "@/modules/auth";
import { useAppSelector } from "@/store/hooks";
import { Navigate, Outlet } from "react-router-dom";

function GuestOnly() {
  const isLoggued = useAppSelector(selectIsLoggued);

  if (isLoggued) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default GuestOnly;
