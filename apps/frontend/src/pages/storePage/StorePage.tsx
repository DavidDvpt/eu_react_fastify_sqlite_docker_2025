import { useNavigate, useParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Panel, Section } from "@/shared/components/Containers";
import TransactionModal from "@/shared/components/TransactionModal";
import { GenericFilter } from "@/shared/components/GenericFilter/GenericFilter";
import { useQueryParams } from "@/shared/hooks";
import { inventoryPageQuerySchema } from "@/pages/inventoryPage/inventoryPageSchema";
import ItemList from "@/pages/items/components/ItemList";
import StockDetailsPanel from "@/pages/inventoryPage/inventory/components/StockDetailsPanel";
import ItemFilter from "@/pages/items/components/ItemFilter";

function StorePage() {
  const params = useQueryParams();
  const queries = inventoryPageQuerySchema.parse(params);
  const { itemId } = useParams();
  const navigate = useNavigate();

  const handleSelectedItem = (selectedItemId: string) => {
    navigate({
      pathname: `/store/${selectedItemId}`,
      search: location.search,
    });
  };

  return (
    <Panel className="min-h-0 gap-2 mx-0">
      <GenericFilter context="store" className="shadow-ambient-md" />
      <Section className="flex min-h-0 flex-1 overflow-hidden max-lg:flex-col px-0" disableShadow>
        <ItemFilter />
        <Section className="flex min-h-0 flex-1 overflow-hidden max-lg:flex-col flex-row" disableShadow>
          <ItemList
            {...queries}
            mode="store"
            onSelectedItem={handleSelectedItem}
            className={cn(
              "min-h-0 overflow-hidden transition-all duration-300 ease-in-out shadow-ambient-md m-2",
              itemId ? "basis-1/2 max-w-[50%]" : "basis-full max-w-full",
              "max-lg:basis-full max-lg:max-w-full",
            )}
          />
          {Boolean(itemId) && (
            <StockDetailsPanel
              mode="store"
              className="min-h-0 overflow-hidden basis-1/2 max-w-[50%] transition-all duration-300 ease-in-out max-lg:hidden"
              onClose={() => navigate({ pathname: "/store", search: location.search })}
            />
          )}
        </Section>
      </Section>
      <TransactionModal />
    </Panel>
  );
}

export default StorePage;
