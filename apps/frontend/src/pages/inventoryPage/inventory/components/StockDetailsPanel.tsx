import StockMessages from "./StockMessages";

import { cn } from "@/lib/utils";
import { Section } from "@/shared/components/Containers";

import ItemDetail from "@/shared/components/ItemDetail/ItemDetail";

import { useParams } from "react-router-dom";
import useItemStock from "@/shared/hooks/rqFetchHooks/useItemStockData";
import useItemLots from "@/shared/hooks/rqFetchHooks/useItemLotsData";
import { useQueryParams } from "@/shared/hooks";
import { StockLotsSection } from "@/shared/components/sections";

type StockDetailsPanelProps = {
  onClose: () => void;
  className?: string;
};

function StockDetailsPanel({ onClose, className }: StockDetailsPanelProps) {
  const { itemId } = useParams();
  const { lotId } = useQueryParams<{ lotId?: string | string[] }>();

  const item = useItemStock({ itemId });
  const itemLots = useItemLots({ itemId });

  const lots = itemLots?.lots ?? null;
  const focusedLotId = Array.isArray(lotId) ? lotId[0] : lotId;
  // The detail of a lot row is MY instance: resolve the single lot the
  // detail refers to. Falls back to the aggregated item view when absent.
  const focusedLot = lots?.find((lot) => lot.id === focusedLotId) ?? null;

  return (
    <Section className={cn("relative min-h-0 p-0", className)} disableShadow>
      <StockMessages
        isError={item.isError}
        isLoading={item.isLoading}
        details={Boolean(itemId)}
      />

      <ItemDetail
        onBack={onClose}
        item={item.itemWithStock}
        lots={lots}
        focusedLot={focusedLot}
      />

      <StockLotsSection
        lots={lots}
        isTierable={Boolean(
          item.itemWithStock?.type?.hasTierOption &&
            !item.itemWithStock?.type?.isStackable,
        )}
        focusedLotId={focusedLot?.id ?? null}
      />
    </Section>
  );
}

export default StockDetailsPanel;
