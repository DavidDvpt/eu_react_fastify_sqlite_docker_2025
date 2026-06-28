import CheckboxRHF from "@/shared/components/form/Checkbox/CheckboxRHF";
import useTransactionAutoPricing from "@/shared/hooks/useTransactionAutoPricing";
import type {
  AutoPricingFormValues,
  TransactionFormFieldsProps,
} from "@/shared/types";
import { useFormContext } from "react-hook-form";

import { TransactionFields } from "./TransactionFields";
import TransactionSummary from "./TransactionSummary";

function TransactionFormContent({ item, action }: TransactionFormFieldsProps) {
  const form = useFormContext<AutoPricingFormValues>();

  const {
    applyAutoCalculationIfNeeded,
    feeValue,
    isFeeReadOnly,
    quantityValue,
    totalValue,
  } = useTransactionAutoPricing({
    action,
    form,
    unitPrice: item.unitPrice,
  });

  return (
    <>
      <TransactionFields
        quantityLabel="Quantite"
        feeLabel="Fee"
        totalLabel={action === "buy" ? "Achat" : "Vente"}
        totalLabelClassName="text-sm text-black"
        feeReadOnly={isFeeReadOnly}
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
