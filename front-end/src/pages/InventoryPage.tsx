import { useNavigate, useParams, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Panel } from "@/shared/components/Containers";
import { useTransaction } from "@/modules/transactions";
import StockListPanel from "../modules/inventory/components/StockListPanel";
import StockDetailsPanel from "../modules/inventory/components/StockDetailsPanel";
import InventoryTransactionModal from "../modules/inventory/components/InventoryTransactionModal";

function StockPage() {
  const { id, action } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { transactionItem, isTransactionModalOpen } = useTransaction({
    id,
    action,
  });

  const goToInventoryDetail = () => {
    if (!id) {
      navigate("/inventory");
      return;
    }
    navigate({
      pathname: `/inventory/${id}`,
      search: location.search,
    });
  };

  const openTransactionModal = (itemId: string, type: "buy" | "sell") => {
    navigate({
      pathname: `/inventory/${itemId}/${type}`,
      search: location.search,
    });
  };

  return (
    <>
      <Panel className="mx-auto flex h-full min-h-0 max-h-[100%] w-full max-w items-stretch gap-4 overflow-hidden p-4">
        <StockListPanel
          className={cn(
            "min-h-0 overflow-hidden transition-all duration-300 ease-in-out",
            id ? "basis-1/2 max-w-[50%]" : "basis-full max-w-full",
            "max-lg:basis-full max-lg:max-w-full",
          )}
        />

        <div
          className={[
            "min-h-0 overflow-hidden transition-all duration-300 ease-in-out",
            id
              ? "basis-1/2 max-w-[50%] opacity-100"
              : "pointer-events-none basis-0 max-w-0 opacity-0",
            "max-lg:hidden",
          ].join(" ")}
        >
          <StockDetailsPanel
            onClose={() => navigate("/inventory")}
            onBuy={(itemId) => openTransactionModal(itemId, "buy")}
            onSell={(itemId) => openTransactionModal(itemId, "sell")}
          />
        </div>
      </Panel>

      <InventoryTransactionModal
        isOpen={isTransactionModalOpen}
        action={action}
        transactionItem={transactionItem}
        onClose={goToInventoryDetail}
      />
    </>
  );
}

export default StockPage;
