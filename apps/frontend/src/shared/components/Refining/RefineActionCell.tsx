import { FlaskConical } from 'lucide-react';

import type { StockRow } from '@/shared/helpers/stock';

type RefineActionCellProps = {
  item: StockRow;
  onRefine: (row: StockRow) => void;
};

/**
 * Bouton « refiner » en bout de ligne de l'inventaire. Le stopPropagation
 * évite d'ouvrir le détail de l'item quand on clique sur l'icône.
 */
function RefineActionCell({ item, onRefine }: RefineActionCellProps) {
  return (
    <button
      type="button"
      title="Refiner"
      aria-label={`Refiner ${item.name}`}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-text-muted transition-colors hover:bg-surface-hover hover:text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      onClick={(event) => {
        event.stopPropagation();
        onRefine(item);
      }}
    >
      <FlaskConical className="h-4 w-4" />
    </button>
  );
}

export default RefineActionCell;
