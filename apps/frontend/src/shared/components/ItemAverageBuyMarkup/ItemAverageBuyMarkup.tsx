import { cn } from "@/lib/utils";
import type { AverageBuyMarkupResponse } from "@/api/generated/react-query/model";

interface ItemAverageBuyMarkupProps {
  averageBuyMarkup: AverageBuyMarkupResponse | null | undefined;
  className?: string;
}

const EMPTY_VALUE = "-";

function formatMarkup(value: number | null) {
  return value === null ? EMPTY_VALUE : `${value.toFixed(2)}%`;
}

function formatMarkupPair(brut: number | null, net: number | null) {
  return `${formatMarkup(brut)} / ${formatMarkup(net)}`;
}

function ItemAverageBuyMarkup({
  averageBuyMarkup,
  className,
}: ItemAverageBuyMarkupProps) {
  if (!averageBuyMarkup) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-1 text-xs",
        className,
      )}
    >
      <span className="text-text">Global %</span>
      <span className="text-text">=</span>
      <span className="text-text-muted">
        {formatMarkupPair(
          averageBuyMarkup.global.brut,
          averageBuyMarkup.global.net,
        )}
      </span>
      <span className="text-text">Stock %</span>
      <span className="text-text">=</span>
      <span className="text-text-muted">
        {formatMarkupPair(
          averageBuyMarkup.current.brut,
          averageBuyMarkup.current.net,
        )}
      </span>
    </div>
  );
}

export default ItemAverageBuyMarkup;
