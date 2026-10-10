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
import { parseDecimalInput } from "@/shared/helpers/transactionHelpers";

function areSameSnapshot(
  previous: TransactionPricingSnapshot,
  current: TransactionPricingSnapshot,
) {
  return (
    previous.quantity === current.quantity &&
    previous.tt === current.tt &&
    previous.fee === current.fee &&
    previous.ttc === current.ttc &&
    previous.isAuction === current.isAuction
  );
}

function detectChangedField(
  previous: TransactionPricingSnapshot,
  current: TransactionPricingSnapshot,
): TransactionPricingField | null {
  if (previous.quantity !== current.quantity) return "quantity";
  if (previous.tt !== current.tt) return "tt";
  if (previous.fee !== current.fee) return "fee";
  if (previous.ttc !== current.ttc) return "ttc";
  return null;
}

function useTransactionAutoPricing({
  action,
  form,
  unitPrice,
  isNonStackable = false,
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
  const tt = useWatch({ control: form.control, name: "tt" as never });
  const isAuction = useWatch({
    control: form.control,
    name: "isAuction" as never,
  });

  const isAuctionEnabled = Boolean(isAuction);
  const isBuy = action === "buy";
  // Free mode: fee is always user-editable (no auto computation).
  const isFeeReadOnly = isAuctionEnabled ? !isBuy : false;

  const quantityValue = parseDecimalInput(quantity);
  const feeValue = parseDecimalInput(fee);
  const totalValue = parseDecimalInput(ttc);
  const ttValue = parseDecimalInput(tt) || unitPrice;

  const snapshotRef = useRef<TransactionPricingSnapshot | null>(null);
  const skipNextEffectRef = useRef(false);
  const lastEditedFieldRef = useRef<TransactionPricingField>("quantity");

  const currentSnapshot = useMemo<TransactionPricingSnapshot>(
    () => ({
      quantity: quantityValue,
      tt: ttValue,
      fee: feeValue,
      ttc: totalValue,
      isAuction: isAuctionEnabled,
    }),
    [feeValue, isAuctionEnabled, quantityValue, totalValue, ttValue],
  );

  const syncValues = useCallback(
    (nextValues: TransactionPricingValues) => {
      skipNextEffectRef.current = true;
      form.setValue("quantity" as never, nextValues.quantity as never, {
        shouldDirty: true,
      });
      if (nextValues.tt !== undefined) {
        form.setValue("tt" as never, nextValues.tt as never, { shouldDirty: true });
      }
      form.setValue("fee" as never, nextValues.fee as never, {
        shouldDirty: true,
      });
      form.setValue("ttc" as never, nextValues.ttc as never, {
        shouldDirty: true,
      });
      snapshotRef.current = {
        ...nextValues,
        isAuction: isAuctionEnabled,
      };
    },
    [form, isAuctionEnabled],
  );

  const computeNextValues = useCallback(
    (sourceField: TransactionPricingField): TransactionPricingValues => {
      const baseValues = {
        quantity: currentSnapshot.quantity,
        tt: currentSnapshot.tt,
        fee: currentSnapshot.fee,
        ttc: currentSnapshot.ttc,
        isAuction: isAuctionEnabled,
      };

      const pricingQuantity = isNonStackable ? 1 : baseValues.quantity;
      const pricingUnit: number = isNonStackable
        ? (baseValues.tt ?? unitPrice)
        : unitPrice;

      if (isNonStackable && sourceField === "tt") {
        return computeQuantityPricing({
          action,
          quantity: 1,
          fee: baseValues.fee,
          ttc: baseValues.ttc,
          unitPrice: pricingUnit,
          isAuction: baseValues.isAuction,
        });
      }

      if (sourceField === "quantity") {
        return computeQuantityPricing({
          action,
          quantity: pricingQuantity,
          fee: baseValues.fee,
          ttc: baseValues.ttc,
          unitPrice: pricingUnit,
          isAuction: baseValues.isAuction,
        });
      }

      if (sourceField === "fee") {
        return computeFeePricing({
          action,
          quantity: pricingQuantity,
          fee: baseValues.fee,
          ttc: baseValues.ttc,
          unitPrice: pricingUnit,
          isAuction: baseValues.isAuction,
        });
      }

      return computeTtcPricing({
        action,
        quantity: pricingQuantity,
        fee: baseValues.fee,
        ttc: baseValues.ttc,
        unitPrice: pricingUnit,
        isAuction: baseValues.isAuction,
      });
    },
    [
      action,
      currentSnapshot.fee,
      currentSnapshot.quantity,
      currentSnapshot.tt,
      currentSnapshot.ttc,
      isAuctionEnabled,
      isNonStackable,
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

    if (!isAuctionEnabled) {
      snapshotRef.current = currentSnapshot;
      return;
    }

    if (
      previousSnapshot.isAuction !== currentSnapshot.isAuction &&
      currentSnapshot.isAuction
    ) {
      const nextValues = computeNextValues(lastEditedFieldRef.current);
      if (
        !areSameSnapshot(currentSnapshot, {
          ...nextValues,
          isAuction: true,
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
      areSameSnapshot(currentSnapshot, { ...nextValues, isAuction: true })
    ) {
      snapshotRef.current = currentSnapshot;
      return;
    }

    syncValues(nextValues);
  }, [
    computeNextValues,
    currentSnapshot,
    isAuctionEnabled,
    syncValues,
  ]);

  const applyAuctionIfNeeded = useCallback(
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
    applyAuctionIfNeeded,
    feeValue,
    isAuctionEnabled,
    isFeeReadOnly,
    quantityValue,
    totalValue,
  };
}

export default useTransactionAutoPricing;
