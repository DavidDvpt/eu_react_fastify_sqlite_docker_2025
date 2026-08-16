import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { GenericList } from "@/shared/components";

import { FormatTools } from "@/shared/tools/formatTools";
import type { GenericListViewMode } from "@/shared/types/genericListTypes";
import type { ItemWithStock } from "@/shared/types";

import { stockColumns } from "@/shared/components/GenericList/columnDefinition/stockColumns";
import useInventoryStockData from "@/shared/hooks/rqFetchHooks/useInventoryStockData";

const VIEW_MODE_PARAM_KEY = "viewMode";

type InventoryListProps = {
  className?: string;
  categoryId?: string;
  typeId?: string;
};

function InventoryList({ className, categoryId, typeId }: InventoryListProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const { inventoryStock, isInventoryStockError, isInventoryStockLoading } =
    useInventoryStockData({});

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const showAllItems = searchParams.has("showAllItems");

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

  const onSelectedItem = (itemId: string) => {
    const path = `/inventory/${itemId}`;

    navigate({
      pathname: path,
      search: location.search,
    });
  };

  const urlViewMode = searchParams.get(VIEW_MODE_PARAM_KEY);

  return (
    <GenericList<ItemWithStock>
      columns={stockColumns(urlViewMode === "card")}
      className={className}
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
      hasHeader
      allowCardView
      showViewModeSwitch={false}
      viewMode={urlViewMode as GenericListViewMode | null}
      footer={`Total: ${FormatTools.pedFormat().format(totalStockValue)} Peds`}
    />
  );
}

export default InventoryList;
