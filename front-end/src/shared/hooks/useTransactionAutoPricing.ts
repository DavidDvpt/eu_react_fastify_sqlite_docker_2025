import { useCallback, useEffect, useMemo, useRef } from "react";
import { useWatch } from "react-hook-form";

import {
  computeFeePricing,
  computeQuantityPricing,
  computeTtcPricing,
} from "@/shared/components/TransactionModal/transactionUtils";
import type {
  AutoPricingFormValues,
  TransactionPricingField,
  TransactionPricingSnapshot,
  TransactionPricingValues,
  UseTransactionAutoPricingParams,
  UseTransactionAutoPricingResult,
} from "@/shared/types/transactions";
import { FormatTools } from "../tools";

function areSameSnapshot(
  previous: TransactionPricingSnapshot,
  current: TransactionPricingSnapshot,
) {
  return (
    previous.quantity === current.quantity &&
    previous.fee === current.fee &&
    previous.ttc === current.ttc &&
    previous.autoCalculation === current.autoCalculation
  );
}

function detectChangedField(
  previous: TransactionPricingSnapshot,
  current: TransactionPricingSnapshot,
): TransactionPricingField | null {
  if (previous.quantity !== current.quantity) return "quantity";
  if (previous.fee !== current.fee) return "fee";
  if (previous.ttc !== current.ttc) return "ttc";
  return null;
}

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

  const snapshotRef = useRef<TransactionPricingSnapshot | null>(null);
  const skipNextEffectRef = useRef(false);
  const lastEditedFieldRef = useRef<TransactionPricingField>("quantity");

  const currentSnapshot = useMemo<TransactionPricingSnapshot>(
    () => ({
      quantity: quantityValue,
      fee: feeValue,
      ttc: totalValue,
      autoCalculation: isAutoCalculationEnabled,
    }),
    [feeValue, isAutoCalculationEnabled, quantityValue, totalValue],
  );

  const syncValues = useCallback(
    (nextValues: TransactionPricingValues) => {
      skipNextEffectRef.current = true;
      form.setValue("quantity" as never, nextValues.quantity as never, {
        shouldDirty: true,
      });
      form.setValue("fee" as never, nextValues.fee as never, {
        shouldDirty: true,
      });
      form.setValue("ttc" as never, nextValues.ttc as never, {
        shouldDirty: true,
      });
      snapshotRef.current = {
        ...nextValues,
        autoCalculation: isAutoCalculationEnabled,
      };
    },
    [form, isAutoCalculationEnabled],
  );

  const computeNextValues = useCallback(
    (sourceField: TransactionPricingField): TransactionPricingValues => {
      const baseValues = {
        quantity: currentSnapshot.quantity,
        fee: currentSnapshot.fee,
        ttc: currentSnapshot.ttc,
      };

      if (sourceField === "quantity") {
        return computeQuantityPricing({
          action,
          quantity: baseValues.quantity,
          fee: baseValues.fee,
          ttc: baseValues.ttc,
          unitPrice,
        });
      }

      if (sourceField === "fee") {
        return computeFeePricing({
          action,
          quantity: baseValues.quantity,
          fee: baseValues.fee,
          ttc: baseValues.ttc,
          unitPrice,
        });
      }

      return computeTtcPricing({
        action,
        quantity: baseValues.quantity,
        fee: baseValues.fee,
        ttc: baseValues.ttc,
        unitPrice,
      });
    },
    [
      action,
      currentSnapshot.fee,
      currentSnapshot.quantity,
      currentSnapshot.ttc,
      unitPrice,
    ],
  );

  useEffect(() => {
    if (skipNextEffectRef.current) {
      skipNextEffectRef.current = false;
      snapshotRef.current = currentSnapshot;
      return;
    }

    const previousSnapshot = snapshotRef.current;
    if (!previousSnapshot) {
      snapshotRef.current = currentSnapshot;
      return;
    }

    if (!isAutoCalculationEnabled) {
      snapshotRef.current = currentSnapshot;
      return;
    }

    if (
      previousSnapshot.autoCalculation !== currentSnapshot.autoCalculation &&
      currentSnapshot.autoCalculation
    ) {
      const nextValues = computeNextValues(lastEditedFieldRef.current);
      if (
        !areSameSnapshot(currentSnapshot, {
          ...nextValues,
          autoCalculation: true,
        })
      ) {
        syncValues(nextValues);
      } else {
        snapshotRef.current = currentSnapshot;
      }
      return;
    }

    if (areSameSnapshot(previousSnapshot, currentSnapshot)) {
      return;
    }

    const changedField = detectChangedField(previousSnapshot, currentSnapshot);
    if (!changedField) {
      snapshotRef.current = currentSnapshot;
      return;
    }

    lastEditedFieldRef.current = changedField;
    const nextValues = computeNextValues(changedField);

    if (
      areSameSnapshot(currentSnapshot, { ...nextValues, autoCalculation: true })
    ) {
      snapshotRef.current = currentSnapshot;
      return;
    }

    syncValues(nextValues);
  }, [
    computeNextValues,
    currentSnapshot,
    isAutoCalculationEnabled,
    syncValues,
  ]);

  const applyAutoCalculationIfNeeded = useCallback(
    (checked: boolean) => {
      if (!checked) {
        return;
      }

      const sourceField = lastEditedFieldRef.current;
      const nextValues = computeNextValues(sourceField);
      syncValues(nextValues);
    },
    [computeNextValues, syncValues],
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
