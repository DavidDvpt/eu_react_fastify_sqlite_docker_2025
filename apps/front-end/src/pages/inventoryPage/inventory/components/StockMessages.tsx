interface StockMessagesProps {
  isLoading: boolean;
  isError: boolean;
  details: boolean;
}
function StockMessages({ details, isError, isLoading }: StockMessagesProps) {
  if (!isError || !isLoading) return null;
  return (
    <div className="flex min-h-full flex-col gap-4 pr-1">
      {isLoading && (
        <p className="text-sm text-muted-foreground">
          Chargement des details...
        </p>
      )}
      {isError && (
        <p className="text-sm text-danger">
          Impossible de charger les details.
        </p>
      )}
      {!details && (
        <p className="text-sm text-muted-foreground">
          Selectionne un item dans la liste de stock.
        </p>
      )}
    </div>
  );
}

export default StockMessages;
