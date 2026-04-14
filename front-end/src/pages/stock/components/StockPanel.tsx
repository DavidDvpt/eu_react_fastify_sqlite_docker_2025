import AppCard from "@/components/common/AppCard";
import type { GenericTableColumn } from "@/shared/components/GenericTable";
import { GenericTable } from "@/shared/components";
import { ImageService } from "@/shared/services/imageService";
import { STOCK_ROUTE, type StockRow } from "@/modules/stock";
import styles from "../styles/stock.module.css";

type StockPanelProps = {
  rows: StockRow[];
  isLoading: boolean;
  isError: boolean;
};

const pedFormat = new Intl.NumberFormat("fr-FR", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const stockColumns: GenericTableColumn<StockRow>[] = [
  {
    key: "image",
    header: "Image",
    cellClassName: "w-12",
    render: (item) => {
      const imageUrl = ImageService.getItemImageUrl(item.imageUrlId, "micro");
      if (!imageUrl) {
        return "-";
      }

      return (
        <img
          src={imageUrl}
          alt={item.name}
          className="h-8 w-8 rounded object-contain"
          loading="lazy"
        />
      );
    },
  },
  {
    key: "name",
    header: "Item",
    accessor: "name",
    cellClassName: "font-medium",
  },
  {
    key: "quantity",
    header: "Quantite",
    render: (item) => item.quantity,
  },
  {
    key: "totalPrice",
    header: "Prix total",
    render: (item) => `${pedFormat.format(item.totalPrice)} PED`,
    cellClassName: "text-right",
    headerClassName: "text-right",
  },
];

function StockPanel({ rows, isLoading, isError }: StockPanelProps) {
  const totalPrice = rows.reduce((acc, row) => acc + row.totalPrice, 0);

  return (
    <AppCard
      className={`${styles.card} flex h-full flex-col`}
      title="Stock"
      headerClassName="items-start text-left"
      contentClassName="min-h-0 flex-1"
      content={
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-border bg-background">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <GenericTable<StockRow>
              columns={stockColumns}
              rows={rows}
              getRowKey={(row) => row.itemId}
              isLoading={isLoading}
              isError={isError}
              loadingMessage="Chargement du stock..."
              errorMessage={`Impossible de charger le stock (endpoint attendu: ${STOCK_ROUTE}).`}
              emptyMessage="Aucun item en stock."
            />
          </div>
          <div className="border-t border-border px-4 py-3 text-right text-sm font-semibold text-foreground">
            Total: {pedFormat.format(totalPrice)} PED
          </div>
        </div>
      }
    />
  );
}

export default StockPanel;
