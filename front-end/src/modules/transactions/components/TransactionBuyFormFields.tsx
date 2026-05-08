import { useCallback } from "react";
import type { FocusEvent } from "react";
import { useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import CheckboxRHF from "@/shared/components/form/Checkbox/CheckboxRHF";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import { FormatTools } from "@/shared/tools";
import { getMinimumBuyTtc, sanitizeNonNegative, sanitizeQuantity } from "../helpers";
import type { TransactionBuyFormFieldsProps, TransactionBuyFormValues } from "../types";

function TransactionBuyFormFields({ item }: TransactionBuyFormFieldsProps) {
  const form = useFormContext<TransactionBuyFormValues>();
  const focusValueRef = useRef<{
    quantity?: number;
    fee?: number;
    buyPrice?: number;
  }>({});
  const quantity = useWatch({ control: form.control, name: "quantity" });
  const fee = useWatch({ control: form.control, name: "fee" });
  const buyPrice = useWatch({ control: form.control, name: "buyPrice" });
  const autoCalculation = useWatch({
    control: form.control,
    name: "autoCalculation",
  });
  const isAutoCalculationEnabled = autoCalculation !== false;
  const quantityValue = Number.isFinite(quantity) ? quantity : 0;
  const feeValue = Number.isFinite(fee) ? fee : 0;
  const buyPriceValue = Number.isFinite(buyPrice) ? buyPrice : 0;
  const unitReferenceTotal = quantityValue * item.unitPrice;
  const buyMarkupRatio =
    unitReferenceTotal > 0 ? (buyPriceValue / unitReferenceTotal) * 100 : 0;
  const markupCost = buyPriceValue - feeValue - unitReferenceTotal;

  const applyFromQuantity = useCallback(
    (rawQuantity: number) => {
      const nextQuantity = Math.min(sanitizeQuantity(rawQuantity), item.quantity);
      const nextFee = Math.min(100, sanitizeNonNegative(form.getValues("fee")));
      const tt = nextQuantity * item.unitPrice;
      const nextTtc = getMinimumBuyTtc(tt, nextFee, form.getValues("buyPrice"));

      form.setValue("quantity", nextQuantity, { shouldDirty: true });
      if (isAutoCalculationEnabled) {
        form.setValue("buyPrice", nextTtc, { shouldDirty: true });
        form.setValue("fee", nextFee, { shouldDirty: true });
      }
    },
    [form, isAutoCalculationEnabled, item.quantity, item.unitPrice],
  );

  const applyFromFee = useCallback(
    (rawFee: number) => {
      const nextQuantity = Math.min(
        sanitizeQuantity(form.getValues("quantity")),
        item.quantity,
      );
      const nextFee = Math.min(100, sanitizeNonNegative(rawFee));
      const tt = nextQuantity * item.unitPrice;
      const minTtc = getMinimumBuyTtc(tt, nextFee, form.getValues("buyPrice"));

      form.setValue("quantity", nextQuantity, { shouldDirty: true });
      form.setValue("fee", nextFee, { shouldDirty: true });
      if (isAutoCalculationEnabled) {
        form.setValue("buyPrice", minTtc, { shouldDirty: true });
      }
    },
    [form, isAutoCalculationEnabled, item.quantity, item.unitPrice],
  );

  const applyFromBuyPrice = useCallback(
    (rawBuyPrice: number) => {
      const nextQuantity = Math.min(
        sanitizeQuantity(form.getValues("quantity")),
        item.quantity,
      );
      const tt = nextQuantity * item.unitPrice;
      const nextFee = Math.min(100, sanitizeNonNegative(form.getValues("fee")));
      const minTtc = getMinimumBuyTtc(tt, nextFee, rawBuyPrice);

      form.setValue("quantity", nextQuantity, { shouldDirty: true });
      if (isAutoCalculationEnabled) {
        form.setValue("buyPrice", minTtc, { shouldDirty: true });
        form.setValue("fee", nextFee, { shouldDirty: true });
      }
    },
    [form, isAutoCalculationEnabled, item.quantity, item.unitPrice],
  );

  const applyAutoCalculationIfNeeded = useCallback(
    (checked: boolean) => {
      if (!checked) {
        return;
      }

      const nextQuantity = Math.min(
        sanitizeQuantity(form.getValues("quantity")),
        item.quantity,
      );
      const nextFee = Math.min(100, sanitizeNonNegative(form.getValues("fee")));
      const currentBuyPrice = sanitizeNonNegative(form.getValues("buyPrice"));
      const tt = nextQuantity * item.unitPrice;
      const currentRuleIsValid = tt + nextFee <= currentBuyPrice;

      form.setValue("quantity", nextQuantity, { shouldDirty: true });
      form.setValue("fee", nextFee, { shouldDirty: true });

      if (currentRuleIsValid) {
        return;
      }

      const minTtc = getMinimumBuyTtc(tt, nextFee, tt);
      form.setValue("buyPrice", minTtc, { shouldDirty: true });
    },
    [form, item.quantity, item.unitPrice],
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

  const handleBuyPriceFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      focusValueRef.current.buyPrice = Number(event.target.value);
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

  const handleBuyPriceBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      const current = Number(event.target.value);
      if (focusValueRef.current.buyPrice === current) {
        return;
      }
      applyFromBuyPrice(current);
    },
    [applyFromBuyPrice],
  );

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <InputRHF
          name="quantity"
          type="number"
          min={1}
          max={item.quantity}
          step={1}
          registerOptions={{ valueAsNumber: true }}
          selectOnFocus
          onFocus={handleQuantityFocus}
          onBlur={handleQuantityBlur}
          label="Quantite"
          labelClassName="text-sm text-[var(--color-modal-text)]"
          wrapperClassName="w-[30%] min-w-0"
        />

        <InputRHF
          name="fee"
          type="number"
          min={0}
          max={100}
          step="0.01"
          registerOptions={{ valueAsNumber: true }}
          selectOnFocus
          onFocus={handleFeeFocus}
          onBlur={handleFeeBlur}
          label="Fee (optionnel)"
          labelClassName="text-sm text-[var(--color-modal-text)]"
          wrapperClassName="w-[30%] min-w-0"
        />

        <InputRHF
          name="buyPrice"
          type="number"
          min={0.01}
          step="0.01"
          registerOptions={{ valueAsNumber: true }}
          selectOnFocus
          onFocus={handleBuyPriceFocus}
          onBlur={handleBuyPriceBlur}
          label="Achat"
          labelClassName="text-sm text-[var(--color-modal-text)]"
          wrapperClassName="w-[30%] min-w-0"
        />
      </div>

      <CheckboxRHF
        name="autoCalculation"
        label="Calcul auto"
        labelClassName="text-[var(--color-modal-text)]"
        onCheckedChange={applyAutoCalculationIfNeeded}
      />

      <div className="space-y-1 text-sm text-card-inner-title">
        <p className="m-0">
          Cout TT : {FormatTools.pedFormat().format(unitReferenceTotal)} PED
        </p>
        <p className="m-0">Marlup : {buyMarkupRatio.toFixed(2)}%</p>
        <p
          className={`m-0 ${markupCost < 0 ? "font-bold text-destructive-700" : ""}`}
        >
          Cout markup : {FormatTools.pedFormat().format(markupCost)} PED
        </p>
      </div>
    </>
  );
}

export default TransactionBuyFormFields;
