import Navbar from "@/components/navbar/Navbar";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <>
      <header className="h-10">
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default AppLayout;
