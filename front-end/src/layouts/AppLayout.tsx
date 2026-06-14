import NavBar from "@/components/navbar/Navbar";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <NavBar />
      <main className="flex-1 min-h-0  w-full h-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
