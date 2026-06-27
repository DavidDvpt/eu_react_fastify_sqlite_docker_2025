import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import CheckboxRHF from "@/shared/components/form/Checkbox/CheckboxRHF";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import { FormatTools } from "@/shared/tools";
import { feeCalculation, sanitizeNonNegative } from "../helpers";
import type {
  TransactionSellFormFieldsProps,
  TransactionSellFormValues,
} from "../types";
import useTransactionAutoPricing from "../hooks/useTransactionAutoPricing";

function TransactionSellFormFields({ item }: TransactionSellFormFieldsProps) {
  const form = useFormContext<TransactionSellFormValues>();
  const {
    applyAutoCalculationIfNeeded,
    feeValue,
    handleFeeBlur,
    handleFeeFocus,
    handleQuantityBlur,
    handleQuantityFocus,
    handleTotalBlur,
    handleTotalFocus,
    isAutoCalculationEnabled,
    quantityValue,
    totalValue: ttcValue,
  } = useTransactionAutoPricing({
    form,
    maxQuantity: item.quantity,
    totalField: "ttc",
    unitPrice: item.unitPrice,
  });
  const costTt = quantityValue * item.unitPrice;
  const autoFeeValue = feeCalculation(ttcValue - costTt);
  const grossProfit = ttcValue - costTt;
  const grossPercent = costTt > 0 ? (ttcValue / costTt) * 100 : 0;
  const netProfit = ttcValue - feeValue - costTt;
  const netPercent = costTt > 0 ? ((ttcValue - feeValue) / costTt) * 100 : 0;

  useEffect(() => {
    if (!isAutoCalculationEnabled) {
      return;
    }

    const nextFee = Math.min(100, sanitizeNonNegative(autoFeeValue));
    if (Math.abs(nextFee - feeValue) < 0.000001) {
      return;
    }

    form.setValue("fee", nextFee, { shouldDirty: true });
  }, [autoFeeValue, feeValue, form, isAutoCalculationEnabled]);

  return (
    <>
      <div className="flex items-start justify-between">
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
          labelClassName="text-sm"
          wrapperClassName="w-[30%] min-w-0"
        />

        <InputRHF
          name="fee"
          type="number"
          min={0}
          max={100}
          step="0.01"
          readOnly={isAutoCalculationEnabled}
          registerOptions={{ valueAsNumber: true }}
          selectOnFocus
          onFocus={handleFeeFocus}
          onBlur={handleFeeBlur}
          label="Fee"
          labelClassName="text-sm"
          wrapperClassName="w-[30%] min-w-0"
        />

        <InputRHF
          name="ttc"
          type="number"
          min={0.01}
          step="0.01"
          registerOptions={{ valueAsNumber: true }}
          selectOnFocus
          onFocus={handleTotalFocus}
          onBlur={handleTotalBlur}
          label="TTC"
          labelClassName="text-sm text-[var(--color-modal-text)]"
          wrapperClassName="w-[30%] min-w-0"
        />
      </div>

      <CheckboxRHF
        name="autoCalculation"
        label="Calcul auto"
        onCheckedChange={applyAutoCalculationIfNeeded}
      />

      <div className="space-y-1 text-xs">
        <p className="m-0">
          Cout TT : {FormatTools.pedFormat().format(costTt)} Ped
        </p>
        <p className="m-0">
          Bénéfice brut (TTC - TT) :{" "}
          <span
            className={grossProfit < 0 ? "font-bold text-destructive-700" : ""}
          >
            {FormatTools.pedFormat().format(grossProfit)} Ped (
            {grossPercent.toFixed(2)}%)
          </span>
        </p>
        <p className="m-0">
          Bénéfice net (TTC - fee - TT) :{" "}
          <span
            className={netProfit < 0 ? "font-bold text-destructive-700" : ""}
          >
            {FormatTools.pedFormat().format(netProfit)} Ped (
            {netPercent.toFixed(2)}%)
          </span>
        </p>
      </div>
    </>
  );
}

export default TransactionSellFormFields;
