import { Outlet } from "react-router-dom";
import { Button } from "../components/ui/button";

function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1024px] px-4">
        <Button>test</Button>
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
