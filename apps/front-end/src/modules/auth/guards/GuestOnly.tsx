import { CapsuleLoader } from "@/shared/components";
import { selectIsAuthResolving, selectIsLoggued } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { Navigate, Outlet } from "react-router-dom";

function GuestOnly() {
  const isLoggued = useAppSelector(selectIsLoggued);
  const isAuthResolving = useAppSelector(selectIsAuthResolving);

  if (isAuthResolving) {
    return (
      <CapsuleLoader
        title="Verification de la session"
        subtitle="Reconnexion en cours avant affichage de l'application."
      />
    );
  }

  if (isLoggued) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default GuestOnly;
