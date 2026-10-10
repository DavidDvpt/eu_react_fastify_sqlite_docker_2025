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
  const { action, lotId } = modalParams;
  const isInstanceSell =
    action === "sell" &&
    lotId != null &&
    item.type != null &&
    !item.type.isStackable;
  const isNonStackable = item.type != null && !item.type.isStackable;
  const form = useFormContext<AutoPricingFormValues>();

  const {
    applyAuctionIfNeeded,
    feeValue,
    isAuctionEnabled,
    isFeeReadOnly,
    quantityValue,
    totalValue,
  } = useTransactionAutoPricing({
    action,
    form,
    unitPrice: item.value,
    isNonStackable,
  });

  const lotCount = Number(form.watch("lotCount")) || 1;
  const tt = Number(form.watch("tt")) || item.value;

  return (
    <>
      <TransactionFields
        quantityLabel="Quantite"
        feeLabel="Fee"
        totalLabel={action === "buy" ? "Achat" : "Vente"}
        totalLabelClassName="text-sm text-text"
        feeReadOnly={isFeeReadOnly}
        quantityReadOnly={isInstanceSell}
        isNonStackable={isNonStackable}
        ttReadOnly={action === "sell"}
        isAuction={isAuctionEnabled}
      />

      {action === "buy" && isNonStackable ? (
        <div className="flex items-start justify-between">
          {item.type?.hasTierOption ? (
            <InputRHF
              name="tierLevel"
              type="number"
              min={0}
              max={10}
              step={1}
              registerOptions={{ valueAsNumber: true }}
              label="Tier"
              labelClassName="text-sm"
              wrapperClassName="w-[23%] min-w-0"
            />
          ) : null}

          <InputRHF
            name="lotCount"
            type="number"
            min={1}
            step={1}
            registerOptions={{ valueAsNumber: true }}
            label="Nb de lots"
            labelClassName="text-sm"
            wrapperClassName="w-[23%] min-w-0"
          />
        </div>
      ) : null}

      <CheckboxRHF
        name="isAuction"
        label="Auction"
        labelClassName="text-text"
        onCheckedChange={applyAuctionIfNeeded}
      />

      <TransactionSummary
        ttValue={isNonStackable ? tt : quantityValue * item.value}
        feeValue={feeValue}
        ttcValue={totalValue}
        lotCount={action === "buy" && isNonStackable ? lotCount : undefined}
      />
    </>
  );
}

export default TransactionFormContent;
