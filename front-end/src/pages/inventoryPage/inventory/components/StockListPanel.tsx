import { GenericFilter } from "@/shared/components";
import { Panel } from "@/shared/components/Containers";

import type { StockPanelProps } from "@/shared/types";
import InventoryList from "./InventoryList";

function StockListPanel({ className }: StockPanelProps) {
  return (
    <Panel className={`m-0 gap-2 ${className ?? ""}`}>
      <GenericFilter context="inventory" />
      <InventoryList />
    </Panel>
  );
}

export default StockListPanel;
