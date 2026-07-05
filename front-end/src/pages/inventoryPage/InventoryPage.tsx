import { useNavigate, useParams, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Panel, Section } from "@/shared/components/Containers";
import TransactionModal from "@/shared/components/TransactionModal";
import { GenericFilter } from "@/shared/components/GenericFilter/GenericFilter";
import { useTransaction } from "@/shared/hooks";

import InventoryList from "./inventory/components/InventoryList";
import StockDetailsPanel from "./inventory/components/StockDetailsPanel";
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
    <Panel className="min-h-0 gap-2 mx-0">
      <GenericFilter context="inventory" className="m-2" />

      <Section
        className="flex min-h-0 flex-1 overflow-hidden max-lg:flex-col px-0"
        shadow={false}
      >
        <InventoryListFilter />

        <Section
          className="flex min-h-0 flex-1 overflow-hidden max-lg:flex-col flex-row"
          shadow={false}
        >
          <InventoryList
            className={cn(
              "min-h-0 overflow-hidden transition-all duration-300 ease-in-out shadow-ambient-md m-2",
              hasSelectedItem
                ? "basis-1/2 max-w-[50%]"
                : "basis-full max-w-full",
              "max-lg:basis-full max-lg:max-w-full",
            )}
          />

          {hasSelectedItem && (
            <StockDetailsPanel
              className="min-h-0 overflow-hidden basis-1/2 max-w-[50%] transition-all duration-300 ease-in-out max-lg:hidden "
              onClose={() => navigate("/inventory")}
              onBuy={(itemId) => openTransactionModal(itemId, "buy")}
              onSell={(itemId) => openTransactionModal(itemId, "sell")}
            />
          )}
        </Section>
      </Section>

      <TransactionModal
        isOpen={isTransactionModalOpen}
        transactionItem={transactionItem}
        onClose={goToInventoryDetail}
      />
    </Panel>
  );
}

export default InventoryPage;
