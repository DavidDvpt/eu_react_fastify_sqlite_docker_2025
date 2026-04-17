import type { StockLotIn } from "@/types";
import { Section } from "@/shared/components/Containers";
import type { ContainerType } from "@/types/containerTypes";
import { FormatTools } from "@/shared/tools/formatTools";

interface StockLotInListProps {
  lotList: StockLotIn[] | null;
  containerType: ContainerType;
}

function StockLotInList({ lotList }: StockLotInListProps) {
  if (!lotList) return null;
  const visibleLots = lotList.filter((lot) => lot.quantityRemaining > 0);
  const soldOutLotsCount = lotList.filter(
    (lot) => lot.quantityRemaining === 0,
  ).length;

  return (
    <Section className="flex min-h-0 flex-1 flex-col overflow-hidden ">
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
              <span className="text-right">Quantite depart</span>
              <span className="text-right">Remaining</span>
            </div>
            <ul className="m-0 list-none p-0">
              {visibleLots.map((lot) => {
                return (
                  <li
                    key={lot.id}
                    className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 border-b border-card-inner-border px-2 py-1 text-xs text-table-body-text last:border-b-0"
                  >
                    <span>{FormatTools.dateFrShort(lot.dateCreated)}</span>
                    <span className="text-right">{lot.quantityInitial}</span>
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

export default StockLotInList;
