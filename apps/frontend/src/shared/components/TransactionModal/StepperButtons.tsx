import { ChevronDown, ChevronUp } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { parseDecimalInput } from "@/shared/helpers/transactionHelpers";

type StepperButtonsProps = {
  /** RHF field name holding a decimal value (number or numeric string). */
  name: "fee" | "ttc" | "tt";
  /** Increment applied per click. */
  step?: number;
  /** Rounding precision (avoids float dust, e.g. 0.1 + 0.2). */
  decimals?: number;
  disabled?: boolean;
};

/**
 * +/- steppers for text-based decimal inputs (native number spinners
 * are unavailable on `type="text"`, which we need for locale-proof
 * decimal entry).
 */
function StepperButtons({
  name,
  step = 1,
  decimals = 5,
  disabled = false,
}: StepperButtonsProps) {
  const { getValues, setValue } = useFormContext();

  const nudge = (direction: 1 | -1) => {
    if (disabled) return;
    const factor = 10 ** decimals;
    const next =
      Math.round((parseDecimalInput(getValues(name)) + direction * step) * factor) /
      factor;
    setValue(name, next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const buttonClassName = cn(
    "flex h-1/2 items-center justify-center border-none bg-transparent p-0 text-text/60 cursor-pointer hover:text-text focus:outline-none",
    disabled ? "cursor-not-allowed opacity-30 hover:text-text/60" : "",
  );

  return (
    <span className="absolute inset-y-0 right-1 inline-flex w-5 flex-col py-0.5">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Augmenter"
        className={buttonClassName}
        disabled={disabled}
        onClick={() => nudge(1)}
      >
        <ChevronUp className="h-3 w-3" />
      </button>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Diminuer"
        className={buttonClassName}
        disabled={disabled}
        onClick={() => nudge(-1)}
      >
        <ChevronDown className="h-3 w-3" />
      </button>
    </span>
  );
}

export default StepperButtons;
