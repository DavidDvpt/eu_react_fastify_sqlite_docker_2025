import type { StockLotOut } from "@/modules/stock";
import { FormatTools } from "@/shared/tools/formatTools";

interface StockLotOutListProps {
  lotList: StockLotOut[] | null;
}

function StockLotOutList({ lotList }: StockLotOutListProps) {
  if (!lotList) return null;

  return (
    <section className="shadow-card-inner min-h-0 rounded-md border border-card-inner-border bg-card-inner p-3 overflow-hidden">
      <h4 className="mb-2 text-sm font-semibold text-card-inner-title">
        Lots OUT
      </h4>
      <div className="max-h-32 overflow-y-auto pr-1">
        {lotList.length === 0 ? (
          <p className="m-0 text-sm text-card-inner-title">Aucun lot OUT.</p>
        ) : (
          <>
            <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_0.9fr] gap-2 border-b border-card-inner-border px-2 py-1 text-xs font-semibold text-card-inner-title">
              <span>Date</span>
              <span className="text-right">Quantite</span>
              <span className="text-right">TT</span>
              <span className="text-right">TTC</span>
            </div>
            <ul className="m-0 list-none p-0">
              {lotList.map((lot) => (
                <li
                  key={lot.id}
                  className="grid grid-cols-[1.4fr_0.8fr_0.9fr_0.9fr] gap-2 border-b border-card-inner-border px-2 py-1 text-xs text-table-body-text last:border-b-0"
                >
                  <span>{FormatTools.dateFrShort(lot.dateCreated)}</span>
                  <span className="text-right">{lot.quantity}</span>
                  <span className="text-right">{lot.tt.toFixed(2)}</span>
                  <span className="text-right">{lot.ttc.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}

export default StockLotOutList;
