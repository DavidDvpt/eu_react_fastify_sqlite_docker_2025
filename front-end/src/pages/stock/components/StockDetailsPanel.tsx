import AppCard from "@/components/common/AppCard";
import { ImageService } from "@/shared/services/imageService";
import type { StockDetails } from "@/modules/stock";
import { cn } from "@/lib/utils";

type StockDetailsPanelProps = {
  details: StockDetails | null;
  isLoading: boolean;
  isError: boolean;
  className?: string;
};

const pedFormat = new Intl.NumberFormat("fr-FR", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function StockDetailsPanel({
  details,
  isLoading,
  isError,
  className,
}: StockDetailsPanelProps) {
  const formatDate = (value: string) => (value ? value.slice(0, 10) : "-");

  return (
    <AppCard
      className={cn("flex h-full min-h-0 flex-col overflow-hidden", className)}
      title="Details item"
      headerClassName="items-start text-left"
      contentClassName="min-h-0 flex-1 overflow-y-auto"
      content={
        <div className="flex min-h-full flex-col gap-4 pr-1">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Chargement des details...</p>
          ) : isError ? (
            <p className="text-sm text-danger">Impossible de charger les details.</p>
          ) : !details ? (
            <p className="text-sm text-muted-foreground">
              Selectionne un item dans la liste de stock.
            </p>
          ) : (
            <>
              <section className="rounded-md border border-border bg-background p-3">
                <div className="mb-3 flex items-start gap-3">
                  {ImageService.getItemImageUrl(details.imageUrlId, "normal") ? (
                    <img
                      src={ImageService.getItemImageUrl(details.imageUrlId, "normal") ?? ""}
                      alt={details.name}
                      className="h-20 w-20 rounded object-contain"
                    />
                  ) : null}
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{details.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {details.itemId}</p>
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-muted-foreground">Prix unitaire</dt>
                  <dd className="text-right font-medium">{pedFormat.format(details.unitPrice)} PED</dd>
                  <dt className="text-muted-foreground">Stock restant</dt>
                  <dd className="text-right font-medium">{details.quantity}</dd>
                </dl>
              </section>

              <section className="min-h-0 rounded-md border border-border bg-background p-3 overflow-hidden">
                <h4 className="mb-2 text-sm font-semibold text-foreground">Lots IN</h4>
                <ul className="max-h-32 overflow-y-auto space-y-2 pr-1">
                  {details.lotsIn.length === 0 ? (
                    <li className="text-sm text-muted-foreground">Aucun lot IN.</li>
                  ) : (
                    details.lotsIn.map((lot) => (
                      <li key={lot.id} className="rounded border border-border px-2 py-1 text-xs">
                        <div className="text-muted-foreground">
                          Date: {formatDate(lot.dateCreated)} | Quantite: {lot.quantityRemaining}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </section>

              <section className="min-h-0 rounded-md border border-border bg-background p-3 overflow-hidden">
                <h4 className="mb-2 text-sm font-semibold text-foreground">Lots OUT</h4>
                <ul className="max-h-32 overflow-y-auto space-y-2 pr-1">
                  {details.lotsOut.length === 0 ? (
                    <li className="text-sm text-muted-foreground">Aucun lot OUT.</li>
                  ) : (
                    details.lotsOut.map((line) => (
                      <li
                        key={`${line.dateCreated}-${line.quantity}-${line.tt}-${line.ttc}`}
                        className="rounded border border-border px-2 py-1 text-xs"
                      >
                        <div className="text-muted-foreground">
                          Date: {formatDate(line.dateCreated)} | Quantite: {line.quantity}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </section>
            </>
          )}
        </div>
      }
    />
  );
}

export default StockDetailsPanel;
