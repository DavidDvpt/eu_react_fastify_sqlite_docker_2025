import { Button } from '@/components/ui/button';
import type { TransactionAction } from '@/shared/types';
import { useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

interface ItemDetailsButtonsProps {
  canSell?: boolean;
  hasStock?: boolean;
  openTransaction: (action: TransactionAction) => void;
}
function ItemDetailsButtons({
  canSell = false,
  openTransaction,
  hasStock = false,
}: ItemDetailsButtonsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hasBuyButton = Boolean(openTransaction);
  const hasSellButton = Boolean(openTransaction) && canSell;

  const backRoute = useMemo(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const section = pathParts[0];

    if (
      pathParts.length !== 2 ||
      (section !== 'inventory' && section !== 'store')
    ) {
      return null;
    }

    const search = new URLSearchParams(searchParams);
    search.delete('lotId');

    return {
      pathname: `/${section}`,
      search: search.toString(),
    };
  }, [location.pathname, searchParams]);

  const onBack = () => {
    if (backRoute) navigate(backRoute);
  };

  return (
    <div className="flex items-center justify-end gap-2 pt-1">
      {hasBuyButton && (
        <Button
          onClick={() => openTransaction('buy')}
          className="w-[100px]"
          size="sm"
          variant="primary"
        >
          Achat
        </Button>
      )}
      {hasSellButton && (
        <Button
          onClick={() => openTransaction('sell')}
          disabled={hasStock}
          className="w-[100px]"
          size="sm"
          variant="primary"
        >
          Vente
        </Button>
      )}
      {backRoute && (
        <Button
          onClick={onBack}
          className="w-[100px]"
          size="sm"
          variant="secondary"
        >
          Retour
        </Button>
      )}
    </div>
  );
}

export default ItemDetailsButtons;
