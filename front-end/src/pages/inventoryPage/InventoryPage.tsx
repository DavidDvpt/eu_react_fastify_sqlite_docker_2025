import { useNavigate, useParams, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Panel, Section } from "@/shared/components/Containers";
import { useTransaction } from "@/modules/transactions";
import InventoryList from "./inventory/components/InventoryList";
import StockDetailsPanel from "./inventory/components/StockDetailsPanel";
import InventoryTransactionModal from "./inventory/components/InventoryTransactionModal";
import { GenericFilter } from "@/shared/components/GenericFilter/GenericFilter";
import InventoryListFilter from "./inventory/components/InventoryListFilter";

function InventoryPage() {
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

  const hasSelectedItem = Boolean(id);

  return (
    <Panel className="min-h-0 gap-2">
      <GenericFilter context="inventory" className="m-0" />

      <Section className="flex min-h-0 flex-1 gap-2 overflow-hidden shadow-none max-lg:flex-col">
        <InventoryListFilter />

        <div
          className={cn(
            "min-h-0 overflow-hidden transition-all duration-300 ease-in-out",
            hasSelectedItem ? "basis-1/2 max-w-[50%]" : "basis-full max-w-full",
            "max-lg:basis-full max-lg:max-w-full",
          )}
        >
          <InventoryList className="h-full min-h-0" />
        </div>

        {hasSelectedItem && (
          <div className="min-h-0 overflow-hidden basis-1/2 max-w-[50%] transition-all duration-300 ease-in-out max-lg:hidden">
            <StockDetailsPanel
              className="h-full min-h-0"
              onClose={() => navigate("/inventory")}
              onBuy={(itemId) => openTransactionModal(itemId, "buy")}
              onSell={(itemId) => openTransactionModal(itemId, "sell")}
            />
          </div>
        )}
      </Section>

      <InventoryTransactionModal
        isOpen={isTransactionModalOpen}
        action={action}
        transactionItem={transactionItem}
        onClose={goToInventoryDetail}
      />
    </Panel>
  );
}

export default InventoryPage;
