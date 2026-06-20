import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { GenericList } from "@/shared/components";
import { STOCK_ROUTE } from "@/shared/services";
import useInventoryList from "../useInventoryList";
import type { ItemInventory } from "../stockTypes";
import { stockColumns } from "./stockColumns";

type InventoryListProps = {
  className?: string;
};

function InventoryList({ className }: InventoryListProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentStock, isLoading, isError } = useInventoryList();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const showAllItems = searchParams.has("showAllItems");
  const isCardView = searchParams.has("cardView");

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

  return (
    <div className={className}>
      <GenericList<ItemInventory>
        columns={stockColumns}
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
        allowCardView
        showViewModeSwitch={false}
        viewMode={isCardView ? "card" : "list"}

        // rowClassName={(row) =>
        //   [
        //     "hover:bg-muted/30 cursor-pointer",
        //     selectedItem === row.id ? "bg-muted/40" : "",
        //   ].join(" ")
        // }
        // footer={`Total: ${FormatTools.pedFormat().format(totalStockValue)} Peds`}
      />
    </div>
  );
}

export default InventoryList;
