import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-background text-foreground">
      <main className="flex-1 overflow-auto">
        <div className="mx-auto flex min-h-full w-full max-w-[1100px] items-center justify-center px-4 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
