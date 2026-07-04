import InputRHF from "@/shared/components/form/Input/InputRHF";

type TransactionFieldRowProps = {
  quantityLabel: string;
  feeLabel: string;
  totalLabel: string;
  totalLabelClassName: string;
  feeReadOnly?: boolean;
};

export function TransactionFields({
  quantityLabel,
  feeLabel,
  totalLabel,
  totalLabelClassName,
  feeReadOnly = false,
}: TransactionFieldRowProps) {
  return (
    <div className="flex items-start justify-between">
      <InputRHF
        name="quantity"
        type="number"
        step={1}
        registerOptions={{ valueAsNumber: true }}
        selectOnFocus
        label={quantityLabel}
        labelClassName="text-sm"
        wrapperClassName="w-[30%] min-w-0"
      />

      <InputRHF
        name="fee"
        type="number"
        min={0}
        max={100}
        step="0.01"
        readOnly={feeReadOnly}
        registerOptions={{ valueAsNumber: true }}
        selectOnFocus
        label={feeLabel}
        labelClassName="text-sm"
        wrapperClassName="w-[30%] min-w-0"
      />

      <InputRHF
        name="ttc"
        type="number"
        step="0.01"
        registerOptions={{ valueAsNumber: true }}
        selectOnFocus
        label={totalLabel}
        labelClassName={totalLabelClassName}
        wrapperClassName="w-[30%] min-w-0"
      />
    </div>
  );
}
