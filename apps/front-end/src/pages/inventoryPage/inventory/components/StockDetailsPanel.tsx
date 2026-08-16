import StockMessages from "./StockMessages";

import { cn } from "@/lib/utils";
import { Section } from "@/shared/components/Containers";

import ItemDetail from "@/shared/components/ItemDetail/ItemDetail";

import { useParams } from "react-router-dom";
import useItemStock from "@/shared/hooks/rqFetchHooks/useItemStockData";
import useItemLots from "@/shared/hooks/rqFetchHooks/useItemLotsData";
import { StockLotsSection } from "@/shared/components/sections";

type StockDetailsPanelProps = {
  onClose: () => void;
  className?: string;
};

function StockDetailsPanel({ onClose, className }: StockDetailsPanelProps) {
  const { itemId } = useParams();

  const item = useItemStock({ itemId });
  const itemLots = useItemLots({ itemId });

  return (
    <Section className={cn("relative min-h-0 p-0", className)} shadow={false}>
      <StockMessages
        isError={item.isError}
        isLoading={item.isLoading}
        details={Boolean(itemId)}
      />

      <ItemDetail onBack={onClose} item={item.itemWithStock} />

      <StockLotsSection lots={itemLots?.lots ?? null} />
    </Section>
  );
}

export default StockDetailsPanel;
