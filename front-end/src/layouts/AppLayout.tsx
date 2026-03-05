import Navbar from "@/components/navbar/Navbar";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <header className="h-[50px] shrink-0 bg-layout-app-bg text-layout-app-fg mb-1 rounded-md">
        <Navbar />
      </header>
      <main className="flex-1 min-h-0 overflow-auto bg-layout-app-bg text-layout-app-fg rounded-md">
        <div className="mx-auto max-w-[1024px] px-4 py-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
