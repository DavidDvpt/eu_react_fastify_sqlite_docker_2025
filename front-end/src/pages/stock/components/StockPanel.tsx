import { GenericTable } from "@/shared/components";
import { STOCK_ROUTE, type StockRow } from "@/modules/stock";

import { stockColumns } from "./stockColumns";
import { FormatTools } from "@/shared/tools/formatTools";

type StockPanelProps = {
  rows: StockRow[];
  isLoading: boolean;
  isError: boolean;
  selectedItemId: string | null;
  onSelectItem: (itemId: string) => void;
  className?: string;
};

function StockPanel({
  rows,
  isLoading,
  isError,
  selectedItemId,
  onSelectItem,
  className,
}: StockPanelProps) {
  const totalPrice = rows.reduce((acc, row) => acc + row.totalPrice, 0);

  return (
    <GenericTable<StockRow>
      columns={stockColumns}
      rows={rows}
      getRowKey={(row) => row.itemId}
      onRowClick={(row) => onSelectItem(row.itemId)}
      isLoading={isLoading}
      isError={isError}
      loadingMessage="Chargement du stock..."
      errorMessage={`Impossible de charger le stock (endpoint attendu: ${STOCK_ROUTE}).`}
      emptyMessage="Aucun item en stock."
      className={className}
      rowClassName={(row) =>
        [
          "hover:bg-muted/30 cursor-pointer",
          selectedItemId === row.itemId ? "bg-muted/40" : "",
        ].join(" ")
      }
      footer={`Total: ${FormatTools.pedFormat().format(totalPrice)} Peds`}
    />
  );
}

export default StockPanel;
