import { useMemo } from "react";

import { GenericList } from "@/shared/components";
import { Section } from "@/shared/components/Containers";

import { FormatTools } from "@/shared/tools/formatTools";
import type { GenericListViewMode } from "@/shared/components/GenericList/genericListTypes";
import type { ItemWithStock } from "@/shared/types";

import { stockColumns } from "@/shared/components/GenericList/columnDefinition/stockColumns";
import useInventoryStockData from "@/shared/hooks/rqFetchHooks/useInventoryStockData";
import type { InventoryPageQuery } from "@/pages/inventoryPage/inventoryPageSchema";

interface InventoryListProps extends InventoryPageQuery {
  className?: string;
  onSelectedItem: (itemId: string) => void;
}

function InventoryList({
  className,
  categoryId,
  typeId,
  showAllItems,
  urlViewMode,
  onSelectedItem,
}: InventoryListProps) {
  const { inventoryStock, isInventoryStockError, isInventoryStockLoading } =
    useInventoryStockData({});

  const visibleStock = useMemo(
    () =>
      inventoryStock
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
      const n = t + c.stock * c.value;
      return n;
    }, 0);
  }, [visibleStock]);

  return (
    <Section className={className}>
      <GenericList<ItemWithStock>
        columns={stockColumns(urlViewMode === "card")}
        rows={visibleStock}
        getRowKey={(row) => row.id}
        onRowClick={(row) => onSelectedItem(row.id)}
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
        viewMode={urlViewMode as GenericListViewMode | null}
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
