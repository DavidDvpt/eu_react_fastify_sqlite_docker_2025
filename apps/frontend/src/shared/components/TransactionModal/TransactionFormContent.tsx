import CheckboxRHF from "@/shared/components/form/Checkbox/CheckboxRHF";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import useTransactionAutoPricing from "@/shared/hooks/useTransactionAutoPricing";
import type {
  AutoPricingFormValues,
  TransactionFormFieldsProps,
} from "@/shared/types";
import { useFormContext } from "react-hook-form";

import { TransactionFields } from "./TransactionFields";
import TransactionSummary from "./TransactionSummary";

function TransactionFormContent({
  item,
  modalParams,
}: TransactionFormFieldsProps) {
  const { action } = modalParams;
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
    unitPrice: item.value,
  });

  return (
    <>
      <TransactionFields
        quantityLabel="Quantite"
        feeLabel="Fee"
        totalLabel={action === "buy" ? "Achat" : "Vente"}
        totalLabelClassName="text-sm text-text"
        feeReadOnly={isFeeReadOnly}
      />

      {action === "buy" &&
      item.type?.hasTierOption &&
      !item.type.isStackable ? (
        <InputRHF
          name="tierLevel"
          type="number"
          min={0}
          max={10}
          step={1}
          registerOptions={{ valueAsNumber: true }}
          label="Tier"
          labelClassName="text-sm"
          wrapperClassName="w-1/3"
        />
      ) : null}

      <CheckboxRHF
        name="autoCalculation"
        label="Calcul auto"
        labelClassName="text-text"
        onCheckedChange={applyAutoCalculationIfNeeded}
      />

      <TransactionSummary
        ttValue={quantityValue * item.value}
        feeValue={feeValue}
        ttcValue={totalValue}
      />
    </>
  );
}

export default TransactionFormContent;
