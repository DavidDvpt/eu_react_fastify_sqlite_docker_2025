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

function RunningSellsSection() {
  const { rows, isLoading, isError } = useRunningSells();

  return (
    <Section className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
      <div className="text-sm font-semibold">Ventes en cours</div>

      <div className="grid grid-cols-[32px_minmax(120px,1fr)_52px_72px_72px_92px] items-center gap-2 border-b pb-2 text-xs font-medium text-muted-foreground">
        <span>Image</span>
        <span>Item</span>
        <span className="text-right">Qte</span>
        <span className="text-right">TT</span>
        <span className="text-right">TTC</span>
        <span className="text-right">Status</span>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-auto pr-1">
        {isLoading && <div className="text-sm text-muted-foreground">Chargement...</div>}
        {isError && <div className="text-sm text-red-500">Erreur de chargement.</div>}
        {!isLoading && !isError && rows.length === 0 && (
          <div className="text-sm text-muted-foreground">Aucune vente en cours.</div>
        )}

        {!isLoading &&
          !isError &&
          rows.map((row) => {
            const imageUrl = row.item?.imageUrlId
              ? ImageService.getItemImageUrl(row.item.imageUrlId, "micro")
              : null;

            return (
              <div
                key={row.sessionLineId}
                className="grid grid-cols-[32px_minmax(120px,1fr)_52px_72px_72px_92px] items-center gap-2 rounded border p-2"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={row.item?.name ?? row.itemName}
                    className="h-7 w-7 rounded object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-muted text-xs">-</div>
                )}

                <div className="truncate text-sm font-medium">{row.item?.name ?? row.itemName}</div>
                <div className="text-right text-sm">{row.quantity}</div>
                <div className="text-right text-sm">{FormatTools.pedFormat().format(row.tt)}</div>
                <div className="text-right text-sm">{FormatTools.pedFormat().format(row.ttc)}</div>
                <div className="text-right">
                  <Select value={row.lineStatus}>
                    <SelectTrigger className="h-7 w-[92px] text-[11px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPENNED">OPENNED</SelectItem>
                      <SelectItem value="CLOSED">CLOSED</SelectItem>
                      <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
      </div>
    </Section>
  );
}

export default RunningSellsSection;
