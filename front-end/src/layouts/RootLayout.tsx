import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col overflow-hidden">
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
