import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import { formatItemNameWithTier, getItemImageUrl } from "@/shared/helpers";
import type { ItemViewModel } from "@zod-schemas";
import EquipmentHeader from "./EquipmentHeader";
import EnhancerLineView from "./EnhancerLineView";
import type { EnhancerLine } from "./types";

function EquipmentSummary({
  label,
  itemId,
  tierLevel,
  itemById,
  amplifierItemId,
  enhancers,
  brokenByKey,
  onBrokenChange,
}: {
  label: string;
  itemId?: string | null;
  tierLevel?: number | null;
  itemById: Map<string, ItemViewModel>;
  amplifierItemId?: string | null;
  enhancers: EnhancerLine[];
  brokenByKey: Record<string, number>;
  onBrokenChange: (key: string, value: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const hasAccessories = Boolean(amplifierItemId) || enhancers.length > 0;
  const equipment = itemId ? itemById.get(itemId) : undefined;
  const amplifier = amplifierItemId ? itemById.get(amplifierItemId) : undefined;
  const accessoriesId = `mining-session-${label.toLowerCase()}-accessories`;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <EquipmentHeader item={equipment} itemId={itemId} tierLevel={tierLevel} />
        {hasAccessories && (
          <button
            type="button"
            aria-label={`${isOpen ? "Fermer" : "Ouvrir"} les accessoires ${label}`}
            aria-expanded={isOpen}
            aria-controls={accessoriesId}
            onClick={() => setIsOpen((current) => !current)}
            className="ml-auto inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-input text-text transition-colors hover:bg-surface-hover"
          >
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {hasAccessories && isOpen && (
        <div id={accessoriesId} className="ml-3 flex flex-col gap-2 border-l border-border pl-3">
          {amplifierItemId && (
            <div className="flex items-center gap-2">
              {amplifier && (
                <ItemImage
                  url={getItemImageUrl(amplifier.imageUrlId, "normal")}
                  alt={amplifier.name}
                  size="small"
                  classname="shrink-0"
                />
              )}
              <span className="truncate text-sm text-text">
                {formatItemNameWithTier({
                  name: amplifier?.name ?? amplifierItemId,
                  hasTierOption: amplifier?.type?.hasTierOption,
                  isStackable: amplifier?.type?.isStackable,
                })}
              </span>
            </div>
          )}
          {enhancers.length > 0 && (
            <div className="flex">
              {enhancers.map((line) => {
                const key = `${label}-${line.socket}`;
                return (
                  <EnhancerLineView
                    key={key}
                    line={line}
                    item={itemById.get(line.itemId)}
                    broken={brokenByKey[key] ?? 0}
                    onBrokenChange={(value) => onBrokenChange(key, value)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default EquipmentSummary;
