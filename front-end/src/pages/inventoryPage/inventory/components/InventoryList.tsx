import { GenericList } from "@/shared/components";

import { stockColumns } from "./stockColumns";

import { STOCK_ROUTE } from "@/shared/services";
import useInventoryList from "../useInventoryList";
import type { ItemInventory } from "../stockTypes";
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Panel } from "@/shared/components/Containers";
import CheckboxApp from "@/shared/components/form/Checkbox/CheckboxApp";

function InventoryList() {
  const [showAllItems, setShowAllItems] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentStock, isLoading, isError } = useInventoryList();

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

  const handleCheckedChange = (checked: boolean) => {
    setShowAllItems(checked);
  };

  return (
    <Panel className="m-0 flex min-h-0 flex-1 gap-1 overflow-hidden">
      <CheckboxApp
        name="show-all-inventory-items"
        label="Afficher tous les items"
        value={showAllItems}
        onCheckedChange={handleCheckedChange}
      />

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
            : 'Aucun item en stock. Cochez "Afficher tous les items" pour voir aussi les stocks à 0.'
        }
        allowCardView

        // rowClassName={(row) =>
        //   [
        //     "hover:bg-muted/30 cursor-pointer",
        //     selectedItem === row.id ? "bg-muted/40" : "",
        //   ].join(" ")
        // }
        // footer={`Total: ${FormatTools.pedFormat().format(totalStockValue)} Peds`}
      />
    </Panel>
  );
}

export default InventoryList;
