import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import { getItemImageUrl } from "@/shared/helpers";
import { useUpdateMiningCostLineApiV2SessionsMiningSessionIdCostLinesLineIdPut } from "@/api/generated/react-query/entropiaManagerAPI";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import type { ItemViewModel } from "@zod-schemas";
import type { EnhancerLine } from "./types";

function EnhancerLineView({
  line,
  item,
  sessionId,
}: {
  line: EnhancerLine;
  item?: ItemViewModel;
  sessionId: string;
}) {
  const name = item?.name ?? line.itemId;
  const consumeMutation = useUpdateMiningCostLineApiV2SessionsMiningSessionIdCostLinesLineIdPut();
  const consume = () => {
    if (!line.costLineId || consumeMutation.isPending || line.quantityRemaining <= 0) return;
    consumeMutation.mutate(
      {
        sessionId,
        lineId: line.costLineId,
        data: { quantity: line.quantityConsumed + 1 },
      },
      { onSuccess: () => void InvalidateQueryAndKeys.miningMutation() },
    );
  };

  return (
    <div className="flex flex-col items-center">
      {item && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                role="button"
                tabIndex={0}
                className="cursor-pointer"
                onClick={consume}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                  }
                }}
              >
                <ItemImage
                  url={getItemImageUrl(item.imageUrlId, "normal")}
                  alt={name}
                  size="small"
                  classname="shrink-0"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div>Socket {line.socket}</div>
              <div>{name}</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <div className="text-xs font-medium text-text">
        {line.quantityRemaining}
      </div>
    </div>
  );
}

export default EnhancerLineView;
