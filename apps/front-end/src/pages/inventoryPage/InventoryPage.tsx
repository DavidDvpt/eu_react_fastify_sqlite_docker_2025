import { useNavigate, useParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Panel, Section } from "@/shared/components/Containers";
import TransactionModal from "@/shared/components/TransactionModal";
import { GenericFilter } from "@/shared/components/GenericFilter/GenericFilter";

import InventoryList from "./inventory/components/InventoryList";
import StockDetailsPanel from "./inventory/components/StockDetailsPanel";
import InventoryListFilter from "./inventory/components/InventoryListFilter";
import { useQueryParams } from "@/shared/hooks";

function InventoryPage() {
  const { category, type } = useQueryParams();
  const { itemId } = useParams();
  const navigate = useNavigate();

  const hasSelectedItem = Boolean(itemId);
  const hasSelectedCategory =
    typeof category === "string" && category.trim().length > 0;
  const hasSelectedType = typeof type === "string" && type.trim().length > 0;
  const canShowInventory = hasSelectedCategory || hasSelectedType;

  return (
    <Panel className="min-h-0 gap-2 mx-0">
      <GenericFilter context="inventory" className="m-2" />

      {canShowInventory ? (
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
              categoryId={category as string}
              typeId={type as string}
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
              />
            )}
          </Section>
        </Section>
      ) : (
        <Section className="mx-2 flex min-h-0 flex-1 items-center justify-center text-center text-black">
          Selectionner une categorie ou un type
        </Section>
      )}

      <TransactionModal />
    </Panel>
  );
}

export default InventoryPage;
