import { useCallback, useEffect, useRef } from "react";
import type { FocusEvent } from "react";
import { useWatch } from "react-hook-form";

import {
  getMinimumBuyTtc,
  sanitizeNonNegative,
  sanitizeQuantity,
} from "../../modules/transactions/helpers";
import type {
  AutoPricingFormValues,
  UseTransactionAutoPricingParams,
  UseTransactionAutoPricingResult,
} from "@/shared/types/transactions";
import { FormatTools } from "../tools";

function useTransactionAutoPricing({
  form,
  feeMode = "auto",
  maxQuantity,
  unitPrice,
}: UseTransactionAutoPricingParams<AutoPricingFormValues>): UseTransactionAutoPricingResult {
  const isFeeAutoCalculated = feeMode === "auto";
  const focusValueRef = useRef<{
    fee?: number;
    quantity?: number;
    total?: number;
  }>({});

  const quantity = useWatch({
    control: form.control,
    name: "quantity" as never,
  });
  const fee = useWatch({
    control: form.control,
    name: "fee" as never,
  });
  const ttcValue = useWatch({
    control: form.control,
    name: "ttc" as never,
  });
  const autoCalculation = useWatch({
    control: form.control,
    name: "autoCalculation" as never,
  });

  const isAutoCalculationEnabled = Boolean(autoCalculation);
  const quantityValue = FormatTools.toSafeNumber(quantity);
  const feeValue = FormatTools.toSafeNumber(fee);
  const totalValue = FormatTools.toSafeNumber(ttcValue);

  useEffect(() => {
    if (isFeeAutoCalculated || feeValue === 0) {
      return;
    }

    form.setValue("fee" as never, 0 as never, { shouldDirty: true });
  }, [feeValue, form, isFeeAutoCalculated]);

  const setTotal = useCallback(
    (value: number) => {
      form.setValue("ttc" as never, value as never, { shouldDirty: true });
    },
    [form],
  );

  const applyFromQuantity = useCallback(
    (rawQuantity: number) => {
      const nextQuantity = Math.min(sanitizeQuantity(rawQuantity), maxQuantity);
      const nextFee = isFeeAutoCalculated
        ? Math.min(
            100,
            sanitizeNonNegative(
              form.getValues("fee" as never) as unknown as number | undefined,
            ),
          )
        : 0;
      const tt = nextQuantity * unitPrice;
      const currentTotal = form.getValues("ttc" as never) as unknown as
        | number
        | undefined;
      const nextTotal = getMinimumBuyTtc(tt, nextFee, currentTotal);

      form.setValue("quantity" as never, nextQuantity as never, {
        shouldDirty: true,
      });
      if (isAutoCalculationEnabled) {
        setTotal(nextTotal);
        form.setValue("fee" as never, nextFee as never, { shouldDirty: true });
      }
    },
    [
      form,
      isAutoCalculationEnabled,
      isFeeAutoCalculated,
      maxQuantity,
      setTotal,
      unitPrice,
    ],
  );

  const applyFromFee = useCallback(
    (rawFee: number) => {
      const nextQuantity = Math.min(
        sanitizeQuantity(
          form.getValues("quantity" as never) as unknown as number | undefined,
        ),
        maxQuantity,
      );
      const nextFee = isFeeAutoCalculated
        ? Math.min(100, sanitizeNonNegative(rawFee))
        : 0;
      const tt = nextQuantity * unitPrice;
      const currentTotal = form.getValues("ttc" as never) as unknown as
        | number
        | undefined;
      const minTotal = getMinimumBuyTtc(tt, nextFee, currentTotal);

      form.setValue("quantity" as never, nextQuantity as never, {
        shouldDirty: true,
      });
      form.setValue("fee" as never, nextFee as never, { shouldDirty: true });
      if (isAutoCalculationEnabled) {
        setTotal(minTotal);
      }
    },
    [
      form,
      isAutoCalculationEnabled,
      isFeeAutoCalculated,
      maxQuantity,
      setTotal,
      unitPrice,
    ],
  );

  const applyFromTotal = useCallback(
    (rawTotal: number) => {
      const nextQuantity = Math.min(
        sanitizeQuantity(
          form.getValues("quantity" as never) as unknown as number | undefined,
        ),
        maxQuantity,
      );
      const tt = nextQuantity * unitPrice;
      const nextFee = isFeeAutoCalculated
        ? Math.min(
            100,
            sanitizeNonNegative(
              form.getValues("fee" as never) as unknown as number | undefined,
            ),
          )
        : 0;
      const minTotal = getMinimumBuyTtc(tt, nextFee, rawTotal);

      form.setValue("quantity" as never, nextQuantity as never, {
        shouldDirty: true,
      });
      if (isAutoCalculationEnabled) {
        setTotal(minTotal);
        form.setValue("fee" as never, nextFee as never, { shouldDirty: true });
      }
    },
    [
      form,
      isAutoCalculationEnabled,
      isFeeAutoCalculated,
      maxQuantity,
      setTotal,
      unitPrice,
    ],
  );

  const applyAutoCalculationIfNeeded = useCallback(
    (checked: boolean) => {
      if (!checked) {
        return;
      }

      const nextQuantity = Math.min(
        sanitizeQuantity(
          form.getValues("quantity" as never) as unknown as number | undefined,
        ),
        maxQuantity,
      );
      const nextFee = isFeeAutoCalculated
        ? Math.min(
            100,
            sanitizeNonNegative(
              form.getValues("fee" as never) as unknown as number | undefined,
            ),
          )
        : 0;
      const currentTotal = sanitizeNonNegative(
        form.getValues("ttc" as never) as unknown as number | undefined,
      );
      const tt = nextQuantity * unitPrice;
      const currentRuleIsValid = tt + nextFee <= currentTotal;

      form.setValue("quantity" as never, nextQuantity as never, {
        shouldDirty: true,
      });
      form.setValue("fee" as never, nextFee as never, { shouldDirty: true });

      if (currentRuleIsValid) {
        return;
      }

      const minTotal = getMinimumBuyTtc(tt, nextFee, tt);
      setTotal(minTotal);
    },
    [form, isFeeAutoCalculated, maxQuantity, setTotal, unitPrice],
  );

  const handleQuantityFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      focusValueRef.current.quantity = Number(event.target.value);
    },
    [],
  );

  const handleFeeFocus = useCallback((event: FocusEvent<HTMLInputElement>) => {
    focusValueRef.current.fee = Number(event.target.value);
  }, []);

  const handleTotalFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      focusValueRef.current.total = Number(event.target.value);
    },
    [],
  );

  const handleQuantityBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      const current = Number(event.target.value);
      if (focusValueRef.current.quantity === current) {
        return;
      }
      applyFromQuantity(current);
    },
    [applyFromQuantity],
  );

  const handleFeeBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      const current = Number(event.target.value);
      if (focusValueRef.current.fee === current) {
        return;
      }
      applyFromFee(current);
    },
    [applyFromFee],
  );

  const handleTotalBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      const current = Number(event.target.value);
      if (focusValueRef.current.total === current) {
        return;
      }
      applyFromTotal(current);
    },
    [applyFromTotal],
  );

  return {
    applyAutoCalculationIfNeeded,
    handleFeeBlur,
    handleFeeFocus,
    handleQuantityBlur,
    handleQuantityFocus,
    handleTotalBlur,
    handleTotalFocus,
    feeValue,
    isAutoCalculationEnabled,
    quantityValue,
    totalValue,
  };
}

export default useTransactionAutoPricing;
