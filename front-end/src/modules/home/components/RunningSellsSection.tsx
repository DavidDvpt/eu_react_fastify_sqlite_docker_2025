import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Section } from "@/shared/components/Containers";
import { ImageService } from "@/shared/services";
import FormatTools from "@/shared/tools/formatTools";
import useRunningSells from "../useRunningSells";
import useUpdateRunningSellStatus from "../useUpdateRunningSellStatus";

function RunningSellsSection() {
  const { rows, isLoading, isError } = useRunningSells();
  const updateStatusMutation = useUpdateRunningSellStatus();

  return (
    <Section className="flex min-h-0 flex-1 flex-col m-2 overflow-hidden p-3 text-sm shadow-ambient-md">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <h2 className="m-0 text-base font-semibold leading-tight text-table-head-text">
            Ventes en cours
          </h2>
        </div>

        <div className="inline-flex min-w-20 items-center justify-center rounded-full border border-table-border bg-bg px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
          {isLoading ? "..." : `${rows.length} ligne(s)`}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="grid grid-cols-[32px_minmax(120px,1fr)_52px_72px_72px_92px] items-center gap-2 border-b border-table-border pb-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          <span>Image</span>
          <span>Item</span>
          <span className="text-right">Qte</span>
          <span className="text-right">TT</span>
          <span className="text-right">TTC</span>
          <span className="text-right">Statut</span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto pr-1">
          {isLoading && (
            <div className="grid min-h-24 place-items-center rounded-xl border border-dashed border-table-border bg-bg p-4 text-sm text-muted-foreground">
              Chargement des ventes en cours...
            </div>
          )}

          {isError && (
            <div className="grid min-h-24 place-items-center rounded-xl border border-destructive-300 bg-destructive-100 p-4 text-sm text-destructive-700">
              Erreur de chargement.
            </div>
          )}

          {updateStatusMutation.isError && (
            <div className="grid min-h-24 place-items-center rounded-xl border border-destructive-300 bg-destructive-100 p-4 text-sm text-destructive-700">
              Impossible de mettre a jour le statut.
            </div>
          )}

          {!isLoading && !isError && rows.length === 0 && (
            <div className="grid min-h-24 place-items-center rounded-xl border border-dashed border-table-border bg-bg p-4 text-sm text-muted-foreground">
              Aucune vente en cours.
            </div>
          )}

          {!isLoading &&
            !isError &&
            rows.map((row) => {
              const imageUrl = row.item?.imageUrlId
                ? ImageService.getItemImageUrl(row.item.imageUrlId, "micro")
                : null;

              const isBusy =
                updateStatusMutation.isPending &&
                row.transactionLotIds.some((id) =>
                  updateStatusMutation.variables?.transactionLotIds?.includes(
                    id,
                  ),
                );

              return (
                <div
                  key={row.groupKey}
                  className="grid grid-cols-[32px_minmax(120px,1fr)_52px_72px_72px_92px] items-center gap-2 rounded-xl border border-table-border bg-bg p-3 shadow-sm transition duration-150 ease-in-out hover:-translate-y-px hover:border-info/30 hover:bg-info/5 hover:shadow-md"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={row.item?.name ?? row.itemName}
                      className="h-8 w-8 rounded-lg border border-table-border bg-muted object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="grid h-8 w-8 place-items-center rounded-lg border border-dashed border-table-border bg-muted text-xs font-semibold text-muted-foreground">
                      -
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="truncate font-semibold text-table-head-text">
                      {row.item?.name ?? row.itemName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {row.transactionLotIds.length} lot(s)
                    </div>
                  </div>

                  <div className="text-right font-medium text-table-body-text">
                    {row.quantity}
                  </div>
                  <div className="text-right font-medium text-table-body-text">
                    {FormatTools.pedFormat().format(row.tt)}
                  </div>
                  <div className="text-right font-medium text-table-body-text">
                    {FormatTools.pedFormat().format(row.ttc)}
                  </div>

                  <div className="flex justify-end">
                    <Select
                      value={row.saleStatus}
                      onValueChange={(value) => {
                        if (value === "RUNNING") {
                          return;
                        }

                        updateStatusMutation.mutate({
                          transactionLotIds: row.transactionLotIds,
                          status: value as "SOLDED" | "RETURNED",
                        });
                      }}
                      disabled={isBusy}
                    >
                      <SelectTrigger className="h-8 w-[92px] rounded-lg border-info/25 bg-info/5 px-2 text-[0.7rem] font-semibold uppercase tracking-[0.04em]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RUNNING">RUNNING</SelectItem>
                        <SelectItem value="SOLDED">SOLDED</SelectItem>
                        <SelectItem value="RETURNED">RETURNED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Section>
  );
}

export default RunningSellsSection;
