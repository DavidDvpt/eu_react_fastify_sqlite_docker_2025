import { cn } from "@/lib/utils";
import { Panel } from "@/shared/components/Containers";

import type { StockPanelProps } from "@/shared/types";
import InventoryList from "./InventoryList";

function StockListPanel({ className }: StockPanelProps) {
  return (
    <Panel className={cn("m-0 min-h-0 gap-2", className)}>
      <InventoryList />
    </Panel>
  );
}

export default StockListPanel;
