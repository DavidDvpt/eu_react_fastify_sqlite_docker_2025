import { cn } from "@/lib/utils";
import { ImageService } from "@/shared/services/imageService";
import { FormatTools } from "@/shared/tools";
import { TradeActions } from "@/shared/components";

import type { TradeItemDetailsProps } from "@/types";

function TradeItemDetails({
  itemName,
  imageUrlId,
  unitPrice,
  quantity,
  onBuy,
  onSell,
  onBack,
  disableBuy = false,
  disableSell = false,
  actionsDirection = "row",
  actionsPlacement = "right",
  className,
  actionsClassName,
  buttonClassName,
}: TradeItemDetailsProps) {
  const image = ImageService.getItemImageUrl(imageUrlId, "normal");
  const price = FormatTools.pedFormat().format(unitPrice);

  return (
    <div
      className={cn(
        actionsPlacement === "bottom"
          ? "flex min-h-0 flex-col gap-4"
          : "flex flex-row items-center justify-between gap-4",
        className,
      )}
    >
      <div className="flex flex-row gap-4 min-w-0">
        <div className="w-[40%]">
          {image ? (
            <img
              src={image}
              alt={itemName}
              className="h-[120px] w-auto rounded object-contain"
            />
          ) : null}
        </div>
        <div className="w-[59%] min-w-0 flex flex-col">
          <h3 className="text-base font-semibold text-card-inner-title mt-0">
            {itemName}
          </h3>

          <dl className="grid grid-cols-2 gap-2 text-smtext-card-inner-title">
            <dt>Prix unitaire</dt>
            <dd>{price} PED</dd>
            <dt>Stock restant</dt>
            <dd>{quantity}</dd>
          </dl>
        </div>
      </div>

      <TradeActions
        direction={actionsDirection}
        className={cn(
          actionsPlacement === "bottom" ? "mt-auto" : undefined,
          actionsClassName,
        )}
        buttonClassName={buttonClassName}
        onBuy={onBuy}
        onSell={onSell}
        onBack={onBack}
        disableBuy={disableBuy}
        disableSell={disableSell}
      />
    </div>
  );
}

export { TradeItemDetails };
