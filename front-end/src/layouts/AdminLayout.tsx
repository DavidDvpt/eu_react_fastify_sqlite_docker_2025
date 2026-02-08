import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-layout-app-bg text-layout-app-fg">
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-[1024px] px-4 py-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
