import CheckboxRHF from "@/shared/components/form/Checkbox/CheckboxRHF";
import useTransactionAutoPricing from "@/shared/hooks/useTransactionAutoPricing";
import type {
  AutoPricingFormValues,
  TransactionFilterRow,
} from "@/shared/types";
import { useFormContext } from "react-hook-form";

import { TransactionFields } from "./TransactionFields";
import TransactionSummary from "./TransactionSummary";

interface TransactionFormContentProps {
  item: TransactionFilterRow;
}

function TransactionFormContent({ item }: TransactionFormContentProps) {
  const form = useFormContext<AutoPricingFormValues>();

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
    totalValue,
  } = useTransactionAutoPricing({
    form,
    feeMode: "fixed-zero",
    maxQuantity: item.quantity,
    unitPrice: item.unitPrice,
  });

  return (
    <>
        <TransactionFields
        item={item}
        quantityLabel="Quantite"
        feeLabel="Fee"
        totalLabel="Achat"
        totalLabelClassName="text-sm text-black"
        feeReadOnly
        onQuantityFocus={handleQuantityFocus}
        onQuantityBlur={handleQuantityBlur}
        onFeeFocus={handleFeeFocus}
        onFeeBlur={handleFeeBlur}
        onTotalFocus={handleTotalFocus}
        onTotalBlur={handleTotalBlur}
      />

      <CheckboxRHF
        name="autoCalculation"
        label="Calcul auto"
        labelClassName="text-black"
        onCheckedChange={applyAutoCalculationIfNeeded}
      />

      <TransactionSummary
        ttValue={quantityValue * item.unitPrice}
        feeValue={feeValue}
        ttcValue={totalValue}
      />
    </>
  );
}

export default TransactionFormContent;
