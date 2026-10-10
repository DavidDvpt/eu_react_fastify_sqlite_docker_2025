import { useMemo } from "react";

import { GenericList } from "@/shared/components";
import { Section } from "@/shared/components/Containers";

import { FormatTools } from "@/shared/tools/formatTools";
import { getItemStockValue, type StockRow } from "@/shared/helpers/stock";

import { stockColumns } from "@/shared/components/GenericList/columnDefinition/stockColumns";
import useInventoryStockData from "@/shared/hooks/rqFetchHooks/useInventoryStockData";
import { buildStockRows } from "@/shared/helpers";
import type { InventoryPageQuery } from "@/pages/inventoryPage/inventoryPageSchema";
import InventoryItemCard from "@/pages/inventoryPage/inventory/components/InventoryItemCard";
import useSystemDatas from "@/shared/hooks/rqFetchHooks/useSystemDatas";

interface ItemListProps extends InventoryPageQuery {
  className?: string;
  onSelectedItem: (itemId: string, lotId?: string | null) => void;
  mode?: "inventory" | "store";
}

function ItemList({
  className,
  categoryId,
  typeId,
  viewMode,
  onSelectedItem,
  mode = "inventory",
}: ItemListProps) {
  const { inventoryStock, isInventoryStockError, isInventoryStockLoading } =
    useInventoryStockData({ enabled: mode === "inventory" });
  const {
    items: { itemDatas, isLoading: isItemsLoading, isError: isItemsError },
  } = useSystemDatas();

  const visibleStock = useMemo(
    () => {
      const rows = mode === "store"
        ? (itemDatas ?? []).map((item) => ({
            ...item,
            stock: 1,
            lots: [],
            lotId: null,
            tierLevel: item.type?.hasTierOption ? 0 : null,
          }))
        : buildStockRows(inventoryStock).filter((item) => item.stock > 0);

      return rows
        .filter(
          (f) =>
            (f.typeId === typeId || typeId === undefined) &&
            (f.type?.categoryId === categoryId || categoryId === undefined),
        );
    },
    [inventoryStock, itemDatas, mode, categoryId, typeId],
  );

  const totalStockValue = useMemo(() => {
    return visibleStock.reduce((t, c) => {
      const n = t + getItemStockValue(c);
      return n;
    }, 0);
  }, [visibleStock]);

  return (
    <Section className={className}>
      <GenericList<StockRow>
        columns={stockColumns(viewMode === "card")}
        rows={visibleStock}
        getRowKey={(row) => row.lotId ?? row.id}
        onRowClick={(row) => onSelectedItem(row.id, row.lotId)}
        isLoading={mode === "store" ? isItemsLoading : isInventoryStockLoading}
        isError={mode === "store" ? isItemsError : isInventoryStockError}
        loadingMessage={mode === "store" ? "Chargement du magasin..." : "Chargement de l'inventaire..."}
        errorMessage={mode === "store" ? "Impossible de charger le magasin." : "Impossible de charger l'inventaire."}
        emptyMessage={mode === "store" ? "Aucun item trouvé." : "Aucun item en stock."}
        headerClassName="pr-3"
        bodyClassName="pr-3"
        rowClassName="group"
        hasHeader
        allowCardView
        showViewModeSwitch={false}
        viewMode={viewMode}
        CardComponent={InventoryItemCard}
        footerConfig={{
          rowClassName: "justify-end py-2 pr-3 font-semibold text-text",
          cells: [
            {
              key: "total-stock-value",
              content: `${mode === "store" ? "Prix total" : "Total"}: ${FormatTools.pedFormat().format(totalStockValue)} Peds`,
            },
          ],
        }}
      />
    </Section>
  );
}

export default ItemList;
