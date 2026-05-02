import { GenericList } from "@/shared/components";

import { stockColumns } from "./stockColumns";

import { STOCK_ROUTE } from "@/shared/services";
import { FormatTools } from "@/shared/tools";
import useInventoryList from "../useInventoryList";
import type { ItemInventory } from "../stockTypes";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function InventoryList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentStock, isLoading, isError, selectedItem, totalStockValue } =
    useInventoryList();

  const onSelectedItem = (itemId: string) => {
    // Si on est sur la liste (/inventory) et qu'on clique sur un élément, on navigue vers /inventory/{itemId}
    // Si on est déjà sur une page de détail (/inventory/{itemId}), on ne fait rien
    // Le composant useInventoryList gérera le rafraîchissement automatique via l'hook useStock
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
    <GenericList<ItemInventory>
      columns={stockColumns}
      rows={currentStock}
      getRowKey={(row) => row.id}
      onRowClick={(row) => onSelectedItem(row.id)}
      isLoading={isLoading}
      isError={isError}
      loadingMessage="Chargement de l'inventaire..."
      errorMessage={`Impossible de charger l'inventaire (endpoint attendu: ${STOCK_ROUTE}).`}
      emptyMessage="Aucun item en stock."
      className="flex-1 min-h-0"
      rowClassName={(row) =>
        [
          "hover:bg-muted/30 cursor-pointer",
          selectedItem === row.id ? "bg-muted/40" : "",
        ].join(" ")
      }
      footer={`Total: ${FormatTools.pedFormat().format(totalStockValue)} Peds`}
    />
  );
}

export default InventoryList;
