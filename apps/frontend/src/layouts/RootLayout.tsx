import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Outlet />
    </div>
  );
}

export default RootLayout;
