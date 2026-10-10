import { useMemo } from "react";

import { GenericList } from "@/shared/components";
import { Section } from "@/shared/components/Containers";

import { FormatTools } from "@/shared/tools/formatTools";
import { getItemStockValue, type StockRow } from "@/shared/helpers/stock";

import { stockColumns } from "@/shared/components/GenericList/columnDefinition/stockColumns";
import useInventoryStockData from "@/shared/hooks/rqFetchHooks/useInventoryStockData";
import { buildStockRows } from "@/shared/helpers";
import type { InventoryPageQuery } from "@/pages/inventoryPage/inventoryPageSchema";
import InventoryItemCard from "./InventoryItemCard";

interface InventoryListProps extends InventoryPageQuery {
  className?: string;
  onSelectedItem: (itemId: string, lotId?: string | null) => void;
}

function InventoryList({
  className,
  categoryId,
  typeId,
  showAllItems,
  viewMode,
  onSelectedItem,
}: InventoryListProps) {
  const { inventoryStock, isInventoryStockError, isInventoryStockLoading } =
    useInventoryStockData();

  const visibleStock = useMemo(
    () =>
      buildStockRows(inventoryStock)
        ?.filter((item) => showAllItems || item.stock !== 0)
        .filter(
          (f) =>
            (f.typeId === typeId || typeId === undefined) &&
            (f.type?.categoryId === categoryId || categoryId === undefined),
        ),
    [inventoryStock, showAllItems, categoryId, typeId],
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
        isLoading={isInventoryStockLoading}
        isError={isInventoryStockError}
        loadingMessage="Chargement de l'inventaire..."
        errorMessage={`Impossible de charger l'inventaire.`}
        emptyMessage={
          showAllItems
            ? "Aucun item trouvé."
            : 'Aucun item en stock. Cochez "Tous les objets" pour voir aussi les stocks à 0.'
        }
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
              content: `Total: ${FormatTools.pedFormat().format(totalStockValue)} Peds`,
            },
          ],
        }}
      />
    </Section>
  );
}

export default InventoryList;
