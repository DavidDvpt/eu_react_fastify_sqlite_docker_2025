import { useNavigate, useParams } from "react-router-dom";
import StockListPanel from "./components/StockListPanel";

import { cn } from "@/lib/utils";
import { Panel } from "@/shared/components/Containers";
import StockDetailsPanel from "./components/StockDetailsPanel";

function StockPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <Panel className="mx-auto flex h-full min-h-0 max-h-[100%] w-full max-w items-stretch gap-4 overflow-hidden p-4">
      <StockListPanel
        className={cn(
          "min-h-0 overflow-hidden transition-all duration-300 ease-in-out",
          id ? "basis-1/2 max-w-[50%]" : "basis-full max-w-full",
          "max-lg:basis-full max-lg:max-w-full",
        )}
      />

      <div
        className={[
          "min-h-0 overflow-hidden transition-all duration-300 ease-in-out",
          id
            ? "basis-1/2 max-w-[50%] opacity-100"
            : "pointer-events-none basis-0 max-w-0 opacity-0",
          "max-lg:hidden",
        ].join(" ")}
      >
        <StockDetailsPanel onClose={() => navigate("/stock")} />
      </div>
    </Panel>
  );
}

export default StockPage;
