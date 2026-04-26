import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { GenericFilter } from "@/shared/components";
import { Panel, Section } from "@/shared/components/Containers";
// import { Button } from "@/components/ui/button";

// import { ArrayTools } from "@/shared/tools";

// import type { TradeFilterRow } from "@/shared/types";
// import { TRADE_ITEM_FILTER_MODEL } from "./contants";
// import {
//   useGenericFilter,
//   useGenericObjectFilter,
//   useItems,
//   useStock,
//   useTypes,
// } from "@/shared/hooks";
// import { filterRowsFunc } from "./utils";
// import TradeBuyPanelContent from "./components/TradeBuyPanelContent";
// import TradeSellPanelContent from "./components/TradeSellPanelContent";

// import ItemDetails from "@/shared/components/ItemDetail/ItemDetail";

function TradePage() {
  const navigate = useNavigate();
  const { id: selectedItemId, action } = useParams<{
    id?: string;
    action?: string;
  }>();

  const handleSelectedItem = useMemo(() => {
    return (itemId: string) => navigate("/trade/" + itemId);
  }, [navigate]);

  // function resetTrade() {
  //   navigate("/trade");
  // }

  // function goToSell() {
  //   if (!selectedItemId) return;
  //   navigate(`/trade/${selectedItemId}/sell`);
  // }

  // function goToBuy() {
  //   if (!selectedItemId) return;
  //   navigate(`/trade/${selectedItemId}/buy`);
  // }

  // function closeActionPanel() {
  //   if (!selectedItemId) {
  //     navigate("/trade");
  //     return;
  //   }
  //   navigate(`/trade/${selectedItemId}`);
  // }

  return (
    <Panel className="flex h-full min-h-0 flex-col gap-2">
      <header className="space-y-2 flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-card-title mt-0">Trade</h1>
      </header>

      {!selectedItemId ? (
        <GenericFilter
          hasAutocomplete={true}
          onSelectedItem={handleSelectedItem}
        />
      ) : (
        <div></div>
        // <Section>
        //   {isPending ? (
        //     <p className="text-sm text-card-inner-title m-0">
        //       Chargement de l'item...
        //     </p>
        //   ) : isError ? (
        //     <p className="text-sm text-danger m-0">
        //       Impossible de charger les donnees stock.
        //     </p>
        //   ) : !selectedItem ? (
        //     <div className="flex items-center justify-between gap-3">
        //       <p className="text-sm text-card-inner-title m-0">
        //         Item introuvable dans le stock courant.
        //       </p>
        //       <Button
        //         type="button"
        //         variant="primary"
        //         onClick={resetTrade}
        //         className="w-[100px]"
        //       >
        //         Retour
        //       </Button>
        //     </div>
        //   ) : (
        //     <ItemDetails
        //       item={selectedItem}
        //       containerType="default"
        //       onBuy={goToBuy}
        //       onSell={goToSell}
        //       onBack={resetTrade}
        //       disableSell={selectedItem.quantity <= 0}
        //       actionsDirection="column"
        //       actionsPlacement="right"
        //       buttonClassName="w-[100px]"
        //     />
        //   )}
        // </Section>
      )}

      {/* {selectedItem && (action === "buy" || action === "sell") ? (
        <Panel>
          <div className="flex gap-3 max-lg:flex-col">
            <Panel className="w-1/2 max-lg:w-full">
              {action === "buy" ? (
                <TradeBuyPanelContent
                  item={selectedItem}
                  onBack={closeActionPanel}
                />
              ) : (
                <TradeSellPanelContent
                  item={selectedItem}
                  onBack={closeActionPanel}
                />
              )}
            </Panel>
            <Panel className="w-1/2 rounded-md border border-dashed border-border bg-background p-3 text-sm text-muted-foreground max-lg:w-full">
              Zone reservee pour les details complementaires.
            </Panel>
          </div>
        </Panel>
      ) : null} */}
    </Panel>
  );
}

export default TradePage;
