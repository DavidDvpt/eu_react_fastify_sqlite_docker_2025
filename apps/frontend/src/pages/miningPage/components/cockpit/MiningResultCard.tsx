import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import { formatItemNameWithTier, getItemImageUrl, NumberHelper } from "@/shared/helpers";
import type { ItemViewModel } from "@zod-schemas";
import IconButton, { IconButtonIcon } from "@/shared/components/IconButton";

const FINALIZE_HOLD_MS = 3000;

type MiningResultCardProps = {
  item: ItemViewModel;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onFinalize: () => void;
  isFinalized: boolean;
  isSaving?: boolean;
};

function MiningResultCard({
  item,
  quantity,
  onQuantityChange,
  onFinalize,
  isFinalized,
  isSaving = false,
}: MiningResultCardProps) {
  const [newQuantity, setNewQuantity] = useState("");
  const [holdProgress, setHoldProgress] = useState(0);
  const holdStartedAt = useRef<number | null>(null);
  const holdCompleted = useRef(false);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const finalizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const name = formatItemNameWithTier({
    name: item.name,
    hasTierOption: item.type?.hasTierOption,
    isStackable: item.type?.isStackable,
  });

  const submitQuantity = () => {
    const parsed = Number(newQuantity);
    if (newQuantity === "" || Number.isNaN(parsed)) return;
    onQuantityChange(Math.max(0, parsed));
  };

  const handleQuantityChange = (value: string) => {
    setNewQuantity(value);
  };

  const cancelFinalize = () => {
    if (holdCompleted.current) return;
    if (holdTimer.current) clearInterval(holdTimer.current);
    if (finalizeTimer.current) clearTimeout(finalizeTimer.current);
    holdTimer.current = null;
    finalizeTimer.current = null;
    holdStartedAt.current = null;
    setHoldProgress(0);
  };

  const startFinalize = () => {
    if (isFinalized || quantity <= 0 || isSaving || holdStartedAt.current !== null) return;
    holdStartedAt.current = Date.now();
    holdCompleted.current = false;
    setHoldProgress(0);
    holdTimer.current = setInterval(() => {
      const elapsed = Date.now() - (holdStartedAt.current ?? Date.now());
      setHoldProgress(Math.min(100, (elapsed / FINALIZE_HOLD_MS) * 100));
    }, 40);
    finalizeTimer.current = setTimeout(() => {
      if (holdTimer.current) clearInterval(holdTimer.current);
      holdTimer.current = null;
      finalizeTimer.current = null;
      holdStartedAt.current = null;
      holdCompleted.current = true;
      setHoldProgress(100);
      onFinalize();
    }, FINALIZE_HOLD_MS);
  };

  useEffect(
    () => () => {
      if (holdTimer.current) clearInterval(holdTimer.current);
      if (finalizeTimer.current) clearTimeout(finalizeTimer.current);
    },
    [],
  );

  const handleQuantityKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitQuantity();
    }
  };

  return (
    <article className={`grid w-[200px] min-w-0 grid-cols-[auto_1fr] gap-3 rounded-lg border border-border bg-surface p-2 text-xs ${isFinalized ? "opacity-60" : ""}`}>
      <ItemImage
        url={getItemImageUrl(item.imageUrlId, "normal")}
        alt={name}
        size="medium"
        classname="h-[70px] w-[70px] shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="line-clamp-2 break-words text-sm font-medium text-text">{name}</div>
        <div className="mt-1 grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-text-muted">
          <span>TT</span>
          <span className="text-right font-bold text-text">
            {NumberHelper.formatNumber(item.value)}
          </span>
          <span>Quantité</span>
          <span className="text-right font-bold text-text">
            {NumberHelper.formatNumber(quantity)}
          </span>
          <span>Valeur</span>
          <span className="text-right font-bold text-text">
            {NumberHelper.formatNumber(quantity * item.value)}
          </span>
        </div>
      </div>
      <div className="col-span-2 flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min={0}
            value={newQuantity}
            placeholder="nouveau montant"
            className="min-w-0 flex-1 font-sans !text-xs"
            disabled={isFinalized || isSaving}
            onKeyDown={handleQuantityKeyDown}
            onChange={(event) => handleQuantityChange(event.target.value)}
          />
          <IconButton
            type="button"
            size="icon"
            variant="primary"
            aria-label="Valider la quantité"
            title="Valider la quantité"
            disabled={isFinalized || isSaving || newQuantity === ""}
            onClick={submitQuantity}
            icon={IconButtonIcon.Enter}
            iconSize={14}
            className="h-8 w-8 shrink-0 rounded-md p-0"
          />
        </div>
        <div className="flex min-w-0 gap-1">
          <Button
            type="button"
            size="sm"
            variant={isFinalized ? "secondary" : "primary"}
            disabled={isFinalized || quantity <= 0 || isSaving}
            onPointerDown={startFinalize}
            onPointerUp={cancelFinalize}
            onPointerLeave={cancelFinalize}
            onPointerCancel={cancelFinalize}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                startFinalize();
              }
            }}
            onKeyUp={(event) => {
              if (event.key === "Enter" || event.key === " ") cancelFinalize();
            }}
            className="relative min-w-0 flex-1 overflow-hidden"
          >
            {!isFinalized && holdProgress > 0 && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 z-0 bg-success-500 transition-[width] duration-75"
                style={{ width: `${holdProgress}%` }}
              />
            )}
            <span className="relative z-10">
              {isFinalized ? "Finalisée" : isSaving ? "Enregistrement…" : "Finaliser"}
            </span>
          </Button>
          <IconButton
            type="button"
            size="icon"
            variant="secondary"
            aria-label="Actions du lot"
            title="Actions du lot"
            icon={IconButtonIcon.More}
            iconSize={16}
            className="h-8 w-8 shrink-0 rounded-full p-0"
          />
        </div>
      </div>
    </article>
  );
}

export default MiningResultCard;
