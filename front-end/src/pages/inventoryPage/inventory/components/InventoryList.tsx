import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { GenericList } from "@/shared/components";
import { STOCK_ROUTE } from "@/shared/services";
import useInventoryList from "../useInventoryList";
import type { ItemInventory } from "../stockTypes";
import { stockColumns } from "../utils/stockColumns";
import { FormatTools } from "@/shared/tools/formatTools";
import { VIEW_MODE_PARAM_KEY } from "@/shared/contants";
import type { GenericListViewMode } from "@/shared/types/genericListTypes";

type InventoryListProps = {
  className?: string;
};

function InventoryList({ className }: InventoryListProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentStock, isLoading, isError, totalStockValue } =
    useInventoryList();

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const showAllItems = searchParams.has("showAllItems");

  const visibleStock = useMemo(
    () => currentStock.filter((item) => showAllItems || item.quantity !== 0),
    [currentStock, showAllItems],
  );

  const onSelectedItem = (itemId: string) => {
    const path =
      id === null && itemId
        ? STOCK_ROUTE.replace(":id", itemId)
        : `/inventory/${itemId}`;

    navigate({
      pathname: path,
      search: location.search,
    });
  };

  const urlViewMode = searchParams.get(VIEW_MODE_PARAM_KEY);

  return (
    <GenericList<ItemInventory>
      columns={stockColumns}
      className={className}
      rows={visibleStock}
      getRowKey={(row) => row.id}
      onRowClick={(row) => onSelectedItem(row.id)}
      isLoading={isLoading}
      isError={isError}
      loadingMessage="Chargement de l'inventaire..."
      errorMessage={`Impossible de charger l'inventaire (endpoint attendu: ${STOCK_ROUTE}).`}
      emptyMessage={
        showAllItems
          ? "Aucun item trouvé."
          : 'Aucun item en stock. Cochez "Tous les objets" pour voir aussi les stocks à 0.'
      }
      hasHeader
      allowCardView
      showViewModeSwitch={false}
      viewMode={urlViewMode as GenericListViewMode | null}
      // rowClassName={(row) =>
      //   [
      //     "hover:bg-muted/30 cursor-pointer",
      //     selectedItem === row.id ? "bg-muted/40" : "",
      //   ].join(" ")
      // }
      footer={`Total: ${FormatTools.pedFormat().format(totalStockValue)} Peds`}
    />
  );
}

export default InventoryList;
