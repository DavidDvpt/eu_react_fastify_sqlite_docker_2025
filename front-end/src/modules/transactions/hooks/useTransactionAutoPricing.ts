import { useCallback, useRef } from "react";
import type { FocusEvent } from "react";
import { useWatch } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import { getMinimumBuyTtc, sanitizeNonNegative, sanitizeQuantity } from "../helpers";

type AutoPricingFormValues<TTotalField extends "buyPrice" | "ttc"> = {
  autoCalculation: boolean;
  quantity: number;
  fee: number;
} & Record<TTotalField, number>;

type UseTransactionAutoPricingParams<
  TTotalField extends "buyPrice" | "ttc",
  TFormValues extends AutoPricingFormValues<TTotalField>,
> = {
  form: UseFormReturn<TFormValues>;
  maxQuantity: number;
  totalField: TTotalField;
  unitPrice: number;
};

type UseTransactionAutoPricingResult = {
  applyAutoCalculationIfNeeded: (checked: boolean) => void;
  handleFeeBlur: (event: FocusEvent<HTMLInputElement>) => void;
  handleFeeFocus: (event: FocusEvent<HTMLInputElement>) => void;
  handleQuantityBlur: (event: FocusEvent<HTMLInputElement>) => void;
  handleQuantityFocus: (event: FocusEvent<HTMLInputElement>) => void;
  handleTotalBlur: (event: FocusEvent<HTMLInputElement>) => void;
  handleTotalFocus: (event: FocusEvent<HTMLInputElement>) => void;
  feeValue: number;
  isAutoCalculationEnabled: boolean;
  quantityValue: number;
  totalValue: number;
};

function toSafeNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function useTransactionAutoPricing<
  TTotalField extends "buyPrice" | "ttc",
  TFormValues extends AutoPricingFormValues<TTotalField>,
>({
  form,
  maxQuantity,
  totalField,
  unitPrice,
}: UseTransactionAutoPricingParams<TTotalField, TFormValues>): UseTransactionAutoPricingResult {
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
  const total = useWatch({
    control: form.control,
    name: totalField as never,
  });
  const autoCalculation = useWatch({
    control: form.control,
    name: "autoCalculation" as never,
  });

  const isAutoCalculationEnabled = Boolean(autoCalculation);
  const quantityValue = toSafeNumber(quantity);
  const feeValue = toSafeNumber(fee);
  const totalValue = toSafeNumber(total);

  const setTotal = useCallback(
    (value: number) => {
      form.setValue(totalField as never, value as never, { shouldDirty: true });
    },
    [form, totalField],
  );

  const applyFromQuantity = useCallback(
    (rawQuantity: number) => {
      const nextQuantity = Math.min(sanitizeQuantity(rawQuantity), maxQuantity);
      const nextFee = Math.min(
        100,
        sanitizeNonNegative(
          form.getValues("fee" as never) as unknown as number | undefined,
        ),
      );
      const tt = nextQuantity * unitPrice;
      const currentTotal = form.getValues(totalField as never) as unknown as
        | number
        | undefined;
      const nextTotal = getMinimumBuyTtc(
        tt,
        nextFee,
        currentTotal,
      );

      form.setValue("quantity" as never, nextQuantity as never, { shouldDirty: true });
      if (isAutoCalculationEnabled) {
        setTotal(nextTotal);
        form.setValue("fee" as never, nextFee as never, { shouldDirty: true });
      }
    },
    [form, isAutoCalculationEnabled, maxQuantity, setTotal, totalField, unitPrice],
  );

  const applyFromFee = useCallback(
    (rawFee: number) => {
      const nextQuantity = Math.min(
        sanitizeQuantity(
          form.getValues("quantity" as never) as unknown as number | undefined,
        ),
        maxQuantity,
      );
      const nextFee = Math.min(100, sanitizeNonNegative(rawFee));
      const tt = nextQuantity * unitPrice;
      const currentTotal = form.getValues(totalField as never) as unknown as
        | number
        | undefined;
      const minTotal = getMinimumBuyTtc(
        tt,
        nextFee,
        currentTotal,
      );

      form.setValue("quantity" as never, nextQuantity as never, { shouldDirty: true });
      form.setValue("fee" as never, nextFee as never, { shouldDirty: true });
      if (isAutoCalculationEnabled) {
        setTotal(minTotal);
      }
    },
    [form, isAutoCalculationEnabled, maxQuantity, setTotal, totalField, unitPrice],
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
      const nextFee = Math.min(
        100,
        sanitizeNonNegative(
          form.getValues("fee" as never) as unknown as number | undefined,
        ),
      );
      const minTotal = getMinimumBuyTtc(tt, nextFee, rawTotal);

      form.setValue("quantity" as never, nextQuantity as never, { shouldDirty: true });
      if (isAutoCalculationEnabled) {
        setTotal(minTotal);
        form.setValue("fee" as never, nextFee as never, { shouldDirty: true });
      }
    },
    [form, isAutoCalculationEnabled, maxQuantity, setTotal, unitPrice],
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
      const nextFee = Math.min(
        100,
        sanitizeNonNegative(
          form.getValues("fee" as never) as unknown as number | undefined,
        ),
      );
      const currentTotal = sanitizeNonNegative(
        form.getValues(totalField as never) as unknown as number | undefined,
      );
      const tt = nextQuantity * unitPrice;
      const currentRuleIsValid = tt + nextFee <= currentTotal;

      form.setValue("quantity" as never, nextQuantity as never, { shouldDirty: true });
      form.setValue("fee" as never, nextFee as never, { shouldDirty: true });

      if (currentRuleIsValid) {
        return;
      }

      const minTotal = getMinimumBuyTtc(tt, nextFee, tt);
      setTotal(minTotal);
    },
    [form, maxQuantity, setTotal, totalField, unitPrice],
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

  const handleTotalFocus = useCallback((event: FocusEvent<HTMLInputElement>) => {
    focusValueRef.current.total = Number(event.target.value);
  }, []);

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
