import { useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { Panel, Section } from '@/shared/components/Containers';
import TransactionModal from '@/shared/components/TransactionModal';
import { GenericFilter } from '@/shared/components/GenericFilter/GenericFilter';
import { RefiningModal } from '@/shared/components/Refining';
import type { StockRow } from '@/shared/helpers/stock';
import { buildStockRows } from '@/shared/helpers';
import { useInventoryStockData } from '@/shared/hooks/rqFetchHooks';

import ItemList from '@/pages/items/components/ItemList';
import StockDetailsPanel from './inventory/components/StockDetailsPanel';
import ItemFilter from '@/pages/items/components/ItemFilter';
import { useQueryParams } from '@/shared/hooks';
import { inventoryPageQuerySchema } from '@/pages/inventoryPage/inventoryPageSchema';

function InventoryPage() {
  const params = useQueryParams();
  const queries = inventoryPageQuerySchema.parse(params);
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { inventoryStock } = useInventoryStockData();
  const refineItemId = searchParams.get('refiningModal');
  const refineTarget = useMemo(
    () => buildStockRows(inventoryStock).find((row) => row.id === refineItemId),
    [inventoryStock, refineItemId],
  );

  const handleSelectedItem = (itemId: string, lotId?: string | null) => {
    const path = `/inventory/${itemId}`;

    const search = new URLSearchParams(location.search);
    if (lotId) {
      search.set('lotId', lotId);
    } else {
      search.delete('lotId');
    }

    navigate({
      pathname: path,
      search: search.toString(),
    });
  };

  const handleRefine = (row: StockRow) => {
    const nextSearch = new URLSearchParams(searchParams);
    nextSearch.set('refiningModal', row.id);
    setSearchParams(nextSearch);
  };

  const closeRefining = () => {
    const nextSearch = new URLSearchParams(searchParams);
    nextSearch.delete('refiningModal');
    setSearchParams(nextSearch);
  };
  // const hasSelectedItem = Boolean(itemId);

  return (
    <Panel className="min-h-0 gap-2 mx-0">
      <GenericFilter context="inventory" className="shadow-ambient-md" />

      <Section
        className="flex min-h-0 flex-1 overflow-hidden max-lg:flex-col px-0"
        disableShadow
      >
        <ItemFilter />

        <Section
          className="flex min-h-0 flex-1 overflow-hidden max-lg:flex-col flex-row"
          disableShadow
        >
          <ItemList
            {...queries}
            mode="inventory"
            onSelectedItem={handleSelectedItem}
            onRefine={handleRefine}
            className={cn(
              'min-h-0 overflow-hidden transition-all duration-300 ease-in-out shadow-ambient-md m-2',
              itemId ? 'basis-3/5 max-w-[60%]' : 'basis-full max-w-full',
              'max-lg:basis-full max-lg:max-w-full',
            )}
          />
          {Boolean(itemId) && (
            <StockDetailsPanel
              mode="inventory"
              className="min-h-0 overflow-hidden basis-2/5 max-w-[40%] transition-all duration-300 ease-in-out max-lg:hidden "
              onClose={() => {
                const search = new URLSearchParams(location.search);
                search.delete('lotId');
                navigate({
                  pathname: '/inventory',
                  search: search.toString(),
                });
              }}
            />
          )}
        </Section>
      </Section>

      <TransactionModal />
      {refineTarget && (
        <RefiningModal item={refineTarget} onClose={closeRefining} />
      )}
    </Panel>
  );
}

export default InventoryPage;
