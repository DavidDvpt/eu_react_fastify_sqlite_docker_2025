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
  ttValue,
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
        "flex h-[40px] w-full items-center gap-3 rounded-md border border-transparent bg-surface pl-1.5 pr-3 py-0 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
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
      <span className={cn("min-w-0 flex-1 truncate", selected ? "text-black" : "text-text")}>{name}</span>
      <span className={cn("shrink-0 text-right text-sm", selected ? "text-black" : "text-text-muted")}>
        {ttValue !== undefined ? `TT ${ttValue.toFixed(2)} PED` : null}
      </span>
      {refinable && (
        <span className={cn("shrink-0 text-sm", selected ? "text-black" : "text-text-muted")}>
          max {maxClickCount}
        </span>
      )}
    </button>
  );
}

export default RefiningRecipeOption;
