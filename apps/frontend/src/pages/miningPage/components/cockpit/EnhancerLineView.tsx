import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import { getItemImageUrl } from "@/shared/helpers";
import { Button } from "@/components/ui/button";
import { useConsumeMiningCostLineApiV2SessionsMiningSessionIdCostLinesLineIdConsumePost } from "@/api/generated/react-query/entropiaManagerAPI";
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
  const consumeMutation = useConsumeMiningCostLineApiV2SessionsMiningSessionIdCostLinesLineIdConsumePost();
  const consume = () => {
    if (!line.costLineId) return;
    consumeMutation.mutate(
      { sessionId, lineId: line.costLineId },
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
      {line.costLineId && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-1 !h-7 !px-2 !text-[10px]"
          disabled={consumeMutation.isPending || line.quantityRemaining <= 0}
          onClick={consume}
        >
          {consumeMutation.isPending ? "..." : "Consommer"}
        </Button>
      )}
    </div>
  );
}

export default EnhancerLineView;
