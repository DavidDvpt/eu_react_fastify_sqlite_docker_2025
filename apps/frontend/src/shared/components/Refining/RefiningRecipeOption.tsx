import { cn } from "@/lib/utils";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import type { RefiningRecipeOptionData } from "./refiningTypes";

type RefiningRecipeOptionProps = RefiningRecipeOptionData & {
  selected: boolean;
  onSelect: (resultId: string) => void;
};

function RefiningRecipeOption({
  resultId,
  name,
  imageUrl,
  maxClickCount,
  refinable,
  selected,
  onSelect,
}: RefiningRecipeOptionProps) {
  return (
    <button
      type="button"
      disabled={!refinable && !selected}
      aria-pressed={selected}
      title={refinable ? name : `${name} (stock insuffisant)`}
      onClick={() => onSelect(resultId)}
      className={cn(
        "flex w-full items-center gap-3 rounded-md border border-border bg-surface px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        selected
          ? "border-primary-500 bg-surface-hover"
          : "hover:bg-surface-hover",
        !refinable && "cursor-not-allowed opacity-40",
      )}
    >
      <ItemImage
        url={imageUrl}
        alt={name}
        size="small"
        classname="shrink-0"
      />
      <span className="min-w-0 flex-1 truncate text-text">{name}</span>
      {refinable && (
        <span className="shrink-0 text-sm text-text-muted">
          max {maxClickCount} résultat{maxClickCount > 1 ? "s" : ""}
        </span>
      )}
    </button>
  );
}

export default RefiningRecipeOption;
