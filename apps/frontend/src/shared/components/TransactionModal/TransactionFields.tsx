import InputRHF from "@/shared/components/form/Input/InputRHF";
import StepperButtons from "./StepperButtons";

type TransactionFieldRowProps = {
  quantityLabel: string;
  feeLabel: string;
  totalLabel: string;
  totalLabelClassName: string;
  feeReadOnly?: boolean;
  quantityReadOnly?: boolean;
  /** Free mode allows decimal TTC (5 decimals max). Defaults to auction. */
  isAuction?: boolean;
  isNonStackable?: boolean;
  ttReadOnly?: boolean;
};

export function TransactionFields({
  quantityLabel,
  feeLabel,
  totalLabel,
  totalLabelClassName,
  feeReadOnly = false,
  quantityReadOnly = false,
  isAuction = true,
  isNonStackable = false,
  ttReadOnly = false,
}: TransactionFieldRowProps) {
  const fieldWidthClassName = isNonStackable ? "w-[23%]" : "w-[30%]";

  return (
    <div className="flex items-start justify-between">
      <InputRHF
        name="quantity"
        type="number"
        step={1}
        registerOptions={{ valueAsNumber: true }}
        selectOnFocus
        readOnly={quantityReadOnly}
        label={quantityLabel}
        labelClassName="text-sm"
        wrapperClassName={`${isNonStackable ? "w-[20%]" : fieldWidthClassName} min-w-0`}
      />

      {isNonStackable ? (
        <InputRHF
          name="tt"
          type="text"
          inputMode="decimal"
          readOnly={ttReadOnly}
          selectOnFocus
          placeholder="ex. 22.00000"
          label="TT"
          labelClassName="text-sm"
          wrapperClassName={`${fieldWidthClassName} min-w-0`}
          suffix={<StepperButtons name="tt" step={1} decimals={5} disabled={ttReadOnly} />}
        />
      ) : null}

      <InputRHF
        name="fee"
        type="text"
        inputMode="decimal"
        readOnly={feeReadOnly}
        selectOnFocus
        label={feeLabel}
        labelClassName="text-sm"
        wrapperClassName={`${fieldWidthClassName} min-w-0`}
        suffix={
          <StepperButtons name="fee" step={1} decimals={2} disabled={feeReadOnly} />
        }
      />

      <InputRHF
        name="ttc"
        type="text"
        inputMode="decimal"
        selectOnFocus
        placeholder={isAuction ? undefined : "ex. 24.20000"}
        label={totalLabel}
        labelClassName={totalLabelClassName}
        wrapperClassName={`${fieldWidthClassName} min-w-0`}
        suffix={<StepperButtons name="ttc" step={1} decimals={5} />}
      />
    </div>
  );
}
