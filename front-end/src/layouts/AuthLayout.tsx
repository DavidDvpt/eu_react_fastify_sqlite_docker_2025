import { Outlet } from "react-router-dom";

function AuthLayout() {
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
