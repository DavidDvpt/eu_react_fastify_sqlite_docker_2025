import { Input } from "@/components/ui/input";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import { getItemImageUrl } from "@/shared/helpers";
import type { ItemViewModel } from "@zod-schemas";
import type { EnhancerLine } from "./types";

function EnhancerLineView({
  line,
  item,
  broken,
  onBrokenChange,
}: {
  line: EnhancerLine;
  item?: ItemViewModel;
  broken: number;
  onBrokenChange: (value: number) => void;
}) {
  const name = item?.name ?? line.itemId;

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs font-medium text-text">{item?.socket}</div>
      <div>
        {item && (
          <ItemImage
            url={getItemImageUrl(item.imageUrlId, "normal")}
            alt={name}
            size="small"
            classname="shrink-0"
          />
        )}
      </div>
      <div className="text-xs font-medium text-text">
        {line.quantityRemaining}
      </div>
      <div className="">
        <Input
          aria-label={`Enhancers cassés pour ${name}, socket ${line.socket}`}
          type="number"
          min={0}
          max={line.quantityRemaining}
          value={broken}
          onChange={(event) => {
            const value = Number.parseInt(event.target.value, 10);
            onBrokenChange(
              Number.isFinite(value)
                ? Math.min(Math.max(value, 0), line.quantityRemaining)
                : 0,
            );
          }}
          className="h-9 w-10 p-1 !text-xs"
        />
      </div>
    </div>
  );
}

export default EnhancerLineView;
