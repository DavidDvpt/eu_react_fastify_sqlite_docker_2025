import { Section } from "@/shared/components/Containers";
import { FormatTools } from "@/shared/tools/formatTools";
import type { LotDto } from "@eu/types";

interface StockLotInListProps {
  lots: LotDto[] | null;
}

function StockLotsSection({ lots }: StockLotInListProps) {
  if (!lots) return null;

  const visibleLots = lots.filter((lot) => lot.isActive);
  const soldOutLotsCount = lots.filter(
    (lot) => lot.quantityRemaining === 0,
  ).length;

  return (
    <Section className="flex min-h-0 flex-1 flex-col overflow-hidden p-2 m-2">
      <h4 className="mb-2 text-sm font-semibold text-card-inner-title">
        Lots IN
      </h4>
      <p className="mb-2 text-xs text-card-inner-title">
        Lots soldes: {soldOutLotsCount}
      </p>
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {visibleLots.length === 0 ? (
          <p className="m-0 text-sm text-card-inner-title">Aucun lot IN.</p>
        ) : (
          <>
            <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 border-b border-card-inner-border px-2 py-1 text-xs font-semibold text-card-inner-title">
              <span>Date</span>
              <span className="text-right">Initial</span>
              <span className="text-right">Actuel</span>
            </div>
            <ul className="m-0 list-none p-0">
              {visibleLots.map((lot) => {
                return (
                  <li
                    key={lot.id}
                    className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 border-b border-card-inner-border px-2 py-1 text-xs text-table-body-text last:border-b-0"
                  >
                    <span>{FormatTools.dateFrShort(lot.createdAt)}</span>
                    <span className="text-right">{lot.initialQuantity}</span>
                    <span className="text-right">{lot.quantityRemaining}</span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </Section>
  );
}

export default StockLotsSection;
