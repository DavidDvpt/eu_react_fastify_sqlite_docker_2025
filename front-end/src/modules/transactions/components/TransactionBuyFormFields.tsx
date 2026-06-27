import { useFormContext } from "react-hook-form";

import CheckboxRHF from "@/shared/components/form/Checkbox/CheckboxRHF";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import { FormatTools } from "@/shared/tools";
import type {
  TransactionBuyFormFieldsProps,
  TransactionBuyFormValues,
} from "../types";
import useTransactionAutoPricing from "../hooks/useTransactionAutoPricing";

function TransactionBuyFormFields({ item }: TransactionBuyFormFieldsProps) {
  const form = useFormContext<TransactionBuyFormValues>();
  const {
    applyAutoCalculationIfNeeded,
    feeValue,
    handleFeeBlur,
    handleFeeFocus,
    handleQuantityBlur,
    handleQuantityFocus,
    handleTotalBlur,
    handleTotalFocus,
    quantityValue,
    totalValue: buyPriceValue,
  } = useTransactionAutoPricing({
    form,
    maxQuantity: item.quantity,
    totalField: "buyPrice",
    unitPrice: item.unitPrice,
  });
  const unitReferenceTotal = quantityValue * item.unitPrice;
  const buyMarkupRatio =
    unitReferenceTotal > 0 ? (buyPriceValue / unitReferenceTotal) * 100 : 0;
  const markupCost = buyPriceValue - feeValue - unitReferenceTotal;

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
          onFocus={handleTotalFocus}
          onBlur={handleTotalBlur}
          label="Achat"
          labelClassName="text-sm text-black"
          wrapperClassName="w-[30%] min-w-0"
        />
      </div>

      <CheckboxRHF
        name="autoCalculation"
        label="Calcul auto"
        labelClassName="text-black"
        onCheckedChange={applyAutoCalculationIfNeeded}
        wrapperClassName="mb-1"
      />

      <div className="space-y-1 text-sm">
        <p className="m-0">
          Cout TT : {FormatTools.pedFormat().format(unitReferenceTotal)} PED
        </p>
        <p className="m-0">Marlup : {buyMarkupRatio.toFixed(2)}%</p>
        <p className={`m-0 ${markupCost < 0 ? "text-destructive-700" : ""}`}>
          Cout markup : {FormatTools.pedFormat().format(markupCost)} PED
        </p>
      </div>
    </>
  );
}

export default TransactionBuyFormFields;
