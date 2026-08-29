import { CapsuleLoader } from "@/shared/components";
import { selectIsAuthResolving, selectIsLoggued } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function AuthGuard() {
  const isLoggued = useAppSelector(selectIsLoggued);
  const isAuthResolving = useAppSelector(selectIsAuthResolving);
  const location = useLocation();

  if (isAuthResolving) {
    return (
      <CapsuleLoader
        title="Verification de la session"
        subtitle="Reconnexion en cours avant affichage de l'application."
      />
    );
  }

  if (!isLoggued) {
    return <Navigate to="/auth/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default AuthGuard;
