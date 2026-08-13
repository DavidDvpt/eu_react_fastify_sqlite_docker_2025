import StockMessages from "./StockMessages";
import StockLotInList from "./StockLotList";

import { cn } from "@/lib/utils";
import { Section } from "@/shared/components/Containers";
import type { StockDetailsPanelProps } from "@/shared/types";

import ItemDetail from "@/shared/components/ItemDetail/ItemDetail";

import { useParams } from "react-router-dom";
import useItemStock from "@/shared/hooks/useItemStock";
import useItemLots from "@/shared/hooks/useItemLots";

function StockDetailsPanel({ onClose, className }: StockDetailsPanelProps) {
  const { itemId } = useParams();

  const item = useItemStock({ itemId });
  const lots = useItemLots({ itemId });

  return (
    <Section className={cn("relative min-h-0 p-0", className)} shadow={false}>
      <StockMessages
        isError={item.isError}
        isLoading={item.isLoading}
        details={Boolean(itemId)}
      />

      <ItemDetail onBack={onClose} item={item.itemWithStock} />

      <StockLotInList lotList={lots?.lots ?? null} />
    </Section>
  );
}

export default StockDetailsPanel;
