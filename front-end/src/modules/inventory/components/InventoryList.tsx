import { GenericList } from "@/shared/components";

import { stockColumns } from "./stockColumns";

import { Checkbox } from "@/components/ui/checkbox";
import { STOCK_ROUTE } from "@/shared/services";
import { FormatTools } from "@/shared/tools";
import useInventoryList from "../useInventoryList";
import type { ItemInventory } from "../stockTypes";
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function InventoryList() {
  const [showAllItems, setShowAllItems] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentStock, isLoading, isError, selectedItem, totalStockValue } =
    useInventoryList();

  const visibleStock = useMemo(
    () =>
      showAllItems
        ? currentStock
        : currentStock.filter((item) => item.quantity !== 0),
    [currentStock, showAllItems],
  );

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
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="show-all-inventory-items"
          checked={showAllItems}
          onCheckedChange={(checked) => setShowAllItems(checked === true)}
        />
        <label
          htmlFor="show-all-inventory-items"
          className="text-sm text-[var(--color-modal-text)]"
        >
          Afficher tous les items
        </label>
      </div>

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
            : "Aucun item en stock. Cochez \"Afficher tous les items\" pour voir aussi les stocks à 0."
        }
        className="flex-1 min-h-0"
        rowClassName={(row) =>
          [
            "hover:bg-muted/30 cursor-pointer",
            selectedItem === row.id ? "bg-muted/40" : "",
          ].join(" ")
        }
        footer={`Total: ${FormatTools.pedFormat().format(totalStockValue)} Peds`}
      />
    </div>
  );
}

export default InventoryList;
