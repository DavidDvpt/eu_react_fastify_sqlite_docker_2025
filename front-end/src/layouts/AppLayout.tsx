import Navbar from "@/components/navbar/Navbar";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <header className="h-[80px] shrink-0 bg-layout-app-bg text-layout-app-fg rounded-md">
        <Navbar />
      </header>
      <main className="flex-1 min-h-0 overflow-hidden bg-layout-app-bg text-layout-app-fg rounded-md">
        <div className="h-full min-h-0 w-full px-4 pt-0 py-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
