import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../router/guards";

function AuthLayout() {
  if (isAuthenticated()) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Container centré */}
      <main className="mx-auto flex min-h-screen w-full max-w-[1100px] items-center justify-center px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
