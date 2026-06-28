import { useCallback, useEffect, useMemo, useRef } from "react";
import { useWatch } from "react-hook-form";

import {
  computeFeePricing,
  computeQuantityPricing,
  computeTtcPricing,
  type TransactionPricingValues,
} from "@/pages/inventoryPage/inventory/components/transactionModal/transactionUtils";
import type {
  AutoPricingFormValues,
  UseTransactionAutoPricingParams,
  UseTransactionAutoPricingResult,
} from "@/shared/types/transactions";
import { FormatTools } from "../tools";

function useTransactionAutoPricing({
  action,
  form,
  unitPrice,
}: UseTransactionAutoPricingParams<AutoPricingFormValues>): UseTransactionAutoPricingResult {
  const quantity = useWatch({
    control: form.control,
    name: "quantity" as never,
  });
  const fee = useWatch({
    control: form.control,
    name: "fee" as never,
  });
  const ttc = useWatch({
    control: form.control,
    name: "ttc" as never,
  });
  const autoCalculation = useWatch({
    control: form.control,
    name: "autoCalculation" as never,
  });

  const isAutoCalculationEnabled = Boolean(autoCalculation);
  const isBuy = action === "buy";
  const isFeeReadOnly = !isBuy;

  const quantityValue = FormatTools.toSafeNumber(quantity);
  const feeValue = FormatTools.toSafeNumber(fee);
  const totalValue = FormatTools.toSafeNumber(ttc);

  const prevValuesRef = useRef<TransactionPricingValues | null>(null);
  const ignoreNextTtcEffectRef = useRef(false);
  const currentValues = useMemo(
    () => ({
      quantity: quantityValue,
      fee: feeValue,
      ttc: totalValue,
    }),
    [feeValue, quantityValue, totalValue],
  );

  const syncFormValues = useCallback(
    (nextValues: TransactionPricingValues, options?: { ignoreTtcEffect?: boolean }) => {
      ignoreNextTtcEffectRef.current = Boolean(options?.ignoreTtcEffect);

      form.setValue("quantity" as never, nextValues.quantity as never, {
        shouldDirty: true,
      });
      form.setValue("fee" as never, nextValues.fee as never, {
        shouldDirty: true,
      });
      form.setValue("ttc" as never, nextValues.ttc as never, {
        shouldDirty: true,
      });
      prevValuesRef.current = nextValues;
    },
    [form],
  );

  const runPricingEffect = useCallback(
    (
      shouldSync: (
        previous: TransactionPricingValues,
        current: TransactionPricingValues,
      ) => boolean,
      sync: (current: TransactionPricingValues) => TransactionPricingValues,
      options?: { ignoreTtcEffect?: boolean },
    ) => {
      const previous = prevValuesRef.current;

      if (!previous) {
        prevValuesRef.current = currentValues;
        return;
      }

      if (!isAutoCalculationEnabled) {
        prevValuesRef.current = currentValues;
        return;
      }

      if (!shouldSync(previous, currentValues)) {
        return;
      }

      syncFormValues(sync(currentValues), options);
    },
    [currentValues, isAutoCalculationEnabled, syncFormValues],
  );

  const syncFromQuantity = useCallback(
    (values: TransactionPricingValues) =>
      computeQuantityPricing({
        action,
        quantity: values.quantity,
        fee: values.fee,
        ttc: values.ttc,
        unitPrice,
      }),
    [action, unitPrice],
  );

  const syncFromFee = useCallback(
    (values: TransactionPricingValues) =>
      computeFeePricing({
        action,
        quantity: values.quantity,
        fee: values.fee,
        ttc: values.ttc,
        unitPrice,
      }),
    [action, unitPrice],
  );

  const syncFromTtc = useCallback(
    (values: TransactionPricingValues) =>
      computeTtcPricing({
        action,
        quantity: values.quantity,
        fee: values.fee,
        ttc: values.ttc,
        unitPrice,
      }),
    [action, unitPrice],
  );

  useEffect(() => {
    runPricingEffect(
      (previous, current) => previous.quantity !== current.quantity,
      syncFromQuantity,
      { ignoreTtcEffect: true },
    );
  }, [runPricingEffect, syncFromQuantity]);

  useEffect(() => {
    runPricingEffect(
      (previous, current) => isBuy && previous.fee !== current.fee,
      syncFromFee,
      { ignoreTtcEffect: true },
    );
  }, [isBuy, runPricingEffect, syncFromFee]);

  useEffect(() => {
    if (ignoreNextTtcEffectRef.current) {
      ignoreNextTtcEffectRef.current = false;
      return;
    }

    runPricingEffect(
      (previous, current) => previous.ttc !== current.ttc,
      syncFromTtc,
    );
  }, [runPricingEffect, syncFromTtc]);

  const applyAutoCalculationIfNeeded = useCallback(
    (checked: boolean) => {
      if (!checked) {
        return;
      }

      syncFormValues(
        syncFromQuantity({
          quantity: quantityValue,
          fee: feeValue,
          ttc: totalValue,
        }),
        { ignoreTtcEffect: true },
      );
    },
    [feeValue, quantityValue, syncFormValues, syncFromQuantity, totalValue],
  );

  return {
    applyAutoCalculationIfNeeded,
    feeValue,
    isAutoCalculationEnabled,
    isFeeReadOnly,
    quantityValue,
    totalValue,
  };
}

export default useTransactionAutoPricing;
