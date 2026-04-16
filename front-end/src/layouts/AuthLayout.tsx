import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <main className="flex flex-1 w-full max-w-[1100px] items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
