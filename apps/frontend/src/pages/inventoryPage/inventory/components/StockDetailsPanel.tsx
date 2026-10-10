import StockMessages from "./StockMessages";

import { cn } from "@/lib/utils";
import { Section } from "@/shared/components/Containers";

import ItemDetail from "@/shared/components/ItemDetail/ItemDetail";

import { useParams } from "react-router-dom";
import useItemStock from "@/shared/hooks/rqFetchHooks/useItemStockData";
import useItemLots from "@/shared/hooks/rqFetchHooks/useItemLotsData";
import { useQueryParams } from "@/shared/hooks";
import { StockLotsSection } from "@/shared/components/sections";
import useSystemDatas from "@/shared/hooks/rqFetchHooks/useSystemDatas";

type StockDetailsPanelProps = {
  onClose: () => void;
  className?: string;
  mode?: "inventory" | "store";
};

function StockDetailsPanel({ onClose, className, mode = "inventory" }: StockDetailsPanelProps) {
  const { itemId } = useParams();
  const { lotId } = useQueryParams<{ lotId?: string | string[] }>();

  const item = useItemStock({ itemId, enabled: mode === "inventory" });
  const itemLots = useItemLots({ itemId, enabled: mode === "inventory" });
  const {
    items: { itemDatas, isLoading: isItemsLoading, isError: isItemsError },
  } = useSystemDatas();
  const storeItem = itemDatas?.find((entry) => entry.id === itemId);
  const detailItem = mode === "store" && storeItem
    ? { ...storeItem, stock: 1, lots: [] }
    : item.itemWithStock;

  const lots = mode === "store" ? null : itemLots?.lots ?? null;
  const focusedLotId = Array.isArray(lotId) ? lotId[0] : lotId;
  // The detail of a lot row is MY instance: resolve the single lot the
  // detail refers to. Falls back to the aggregated item view when absent.
  const focusedLot = lots?.find((lot) => lot.id === focusedLotId) ?? null;

  return (
    <Section className={cn("relative min-h-0 p-0", className)} disableShadow>
      <StockMessages
        isError={mode === "store" ? isItemsError : item.isError}
        isLoading={mode === "store" ? isItemsLoading : item.isLoading}
        details={Boolean(itemId)}
      />

      <ItemDetail
        onBack={onClose}
        item={detailItem}
        lots={lots}
        focusedLot={focusedLot}
        variant={mode === "store" ? "store" : "stock"}
      />

      <StockLotsSection
        lots={lots}
        isTierable={mode === "inventory" && Boolean(
          detailItem?.type?.hasTierOption && !detailItem?.type?.isStackable,
        )}
        focusedLotId={focusedLot?.id ?? null}
      />
    </Section>
  );
}

export default StockDetailsPanel;
