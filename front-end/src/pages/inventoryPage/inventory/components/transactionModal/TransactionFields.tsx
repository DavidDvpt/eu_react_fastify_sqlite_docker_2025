import type { FocusEvent } from "react";

import InputRHF from "@/shared/components/form/Input/InputRHF";

import type { TransactionFilterRow } from "@/shared/types/transactions";

type TransactionFieldRowProps = {
  item: TransactionFilterRow;
  quantityLabel: string;
  feeLabel: string;
  totalLabel: string;
  totalLabelClassName: string;
  feeReadOnly?: boolean;
  onQuantityFocus: (event: FocusEvent<HTMLInputElement>) => void;
  onQuantityBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onFeeFocus: (event: FocusEvent<HTMLInputElement>) => void;
  onFeeBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onTotalFocus: (event: FocusEvent<HTMLInputElement>) => void;
  onTotalBlur: (event: FocusEvent<HTMLInputElement>) => void;
};

// type TransactionFieldsProps = TransactionFieldRowProps & {
//   item: TransactionFilterRow;
//   action: "buy" | "sell";
//   toggleLabelClassName?: string;
//   onToggleCheckedChange: (checked: boolean) => void;
//   summary: ReactNode;
// };

export function TransactionFields({
  item,
  quantityLabel,
  feeLabel,
  totalLabel,
  totalLabelClassName,
  feeReadOnly = false,
  onQuantityFocus,
  onQuantityBlur,
  onFeeFocus,
  onFeeBlur,
  onTotalFocus,
  onTotalBlur,
}: TransactionFieldRowProps) {
  return (
    <div className="flex items-start justify-between">
      <InputRHF
        name="quantity"
        type="number"
        min={1}
        max={item.quantity}
        step={1}
        registerOptions={{ valueAsNumber: true }}
        selectOnFocus
        onFocus={onQuantityFocus}
        onBlur={onQuantityBlur}
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
        onFocus={onFeeFocus}
        onBlur={onFeeBlur}
        label={feeLabel}
        labelClassName="text-sm"
        wrapperClassName="w-[30%] min-w-0"
      />

      <InputRHF
        name="ttcValue"
        type="number"
        min={0.01}
        step="0.01"
        registerOptions={{ valueAsNumber: true }}
        selectOnFocus
        onFocus={onTotalFocus}
        onBlur={onTotalBlur}
        label={totalLabel}
        labelClassName={totalLabelClassName}
        wrapperClassName="w-[30%] min-w-0"
      />
    </div>
  );
}

// function TransactionPanelContent({
//   item,
//   action,
//   toggleLabelClassName,
//   onToggleCheckedChange,
//   summary,
//   ...fieldRowProps
// }: TransactionFieldsProps) {
//   void action;

//   return (
//     <>
//       <TransactionFieldRow item={item} {...fieldRowProps} />

//       <CheckboxRHF
//         name="autoCalculation"
//         label="Calcul auto"
//         labelClassName={toggleLabelClassName}
//         onCheckedChange={onToggleCheckedChange}
//       />

//       <div className="space-y-1">{summary}</div>
//     </>
//   );
// }

// function TransactionFields({ item }: { item: TransactionFilterRow }) {
//   const form = useFormContext<TransactionFormValues>();
//   const {
//     applyAutoCalculationIfNeeded,
//     feeValue,
//     handleFeeBlur,
//     handleFeeFocus,
//     handleQuantityBlur,
//     handleQuantityFocus,
//     handleTotalBlur,
//     handleTotalFocus,
//     quantityValue,
//     totalValue: buyPriceValue,
//   } = useTransactionAutoPricing({
//     form,
//     feeMode: "fixed-zero",
//     maxQuantity: item.quantity,
//     totalField: "buyPrice",
//     unitPrice: item.unitPrice,
//   });
//   const unitReferenceTotal = quantityValue * item.unitPrice;
//   const buyMarkupRatio =
//     unitReferenceTotal > 0 ? (buyPriceValue / unitReferenceTotal) * 100 : 0;
//   const markupCost = buyPriceValue - feeValue - unitReferenceTotal;

//   return (
//     <TransactionFieldsRow
//       item={item}
//       action="buy"
//       quantityLabel="Quantite"
//       feeLabel="Fee"
//       totalLabel="Achat"
//       totalLabelClassName="text-sm text-black"
//       feeReadOnly
//       totalFieldName="buyPrice"
//       onQuantityFocus={handleQuantityFocus}
//       onQuantityBlur={handleQuantityBlur}
//       onFeeFocus={handleFeeFocus}
//       onFeeBlur={handleFeeBlur}
//       onTotalFocus={handleTotalFocus}
//       onTotalBlur={handleTotalBlur}
//       onToggleCheckedChange={applyAutoCalculationIfNeeded}
//       toggleLabelClassName="text-black"
//       summary={
//         <>
//           <p className="m-0">
//             Cout TT : {FormatTools.pedFormat().format(unitReferenceTotal)} PED
//           </p>
//           <p className="m-0">Marlup : {buyMarkupRatio.toFixed(2)}%</p>
//           <p className={`m-0 ${markupCost < 0 ? "text-destructive-700" : ""}`}>
//             Cout markup : {FormatTools.pedFormat().format(markupCost)} PED
//           </p>
//         </>
//       }
//     />
//   );
// }

// function TransactionSellFields({ item }: { item: TransactionFilterRow }) {
//   const form = useFormContext<TransactionSellFormValues>();
//   const {
//     applyAutoCalculationIfNeeded,
//     feeValue,
//     handleFeeBlur,
//     handleFeeFocus,
//     handleQuantityBlur,
//     handleQuantityFocus,
//     handleTotalBlur,
//     handleTotalFocus,
//     isAutoCalculationEnabled,
//     quantityValue,
//     totalValue: ttcValue,
//   } = useTransactionAutoPricing({
//     form,
//     maxQuantity: item.quantity,
//     totalField: "ttc",
//     unitPrice: item.unitPrice,
//   });

//   const costTt = quantityValue * item.unitPrice;
//   const autoFeeValue = feeCalculation(ttcValue - costTt);
//   const grossProfit = ttcValue - costTt;
//   const grossPercent = costTt > 0 ? (ttcValue / costTt) * 100 : 0;
//   const netProfit = ttcValue - feeValue - costTt;
//   const netPercent = costTt > 0 ? ((ttcValue - feeValue) / costTt) * 100 : 0;

//   useEffect(() => {
//     if (!isAutoCalculationEnabled) {
//       return;
//     }

//     const nextFee = Math.min(100, sanitizeNonNegative(autoFeeValue));
//     if (Math.abs(nextFee - feeValue) < 0.000001) {
//       return;
//     }

//     form.setValue("fee", nextFee, { shouldDirty: true });
//   }, [autoFeeValue, feeValue, form, isAutoCalculationEnabled]);

//   return (
//     <TransactionFields
//       item={item}
//       action="sell"
//       quantityLabel="Quantite"
//       feeLabel="Fee"
//       totalLabel="TTC"
//       totalLabelClassName="text-sm text-[var(--color-modal-text)]"
//       feeReadOnly={isAutoCalculationEnabled}
//       totalFieldName="ttc"
//       onQuantityFocus={handleQuantityFocus}
//       onQuantityBlur={handleQuantityBlur}
//       onFeeFocus={handleFeeFocus}
//       onFeeBlur={handleFeeBlur}
//       onTotalFocus={handleTotalFocus}
//       onTotalBlur={handleTotalBlur}
//       onToggleCheckedChange={applyAutoCalculationIfNeeded}
//       summary={
//         <>
//           <p className="m-0">
//             Cout TT : {FormatTools.pedFormat().format(costTt)} Ped
//           </p>
//           <p className="m-0">
//             Bénéfice brut (TTC - TT) :{" "}
//             <span
//               className={
//                 grossProfit < 0 ? "font-bold text-destructive-700" : ""
//               }
//             >
//               {FormatTools.pedFormat().format(grossProfit)} Ped (
//               {grossPercent.toFixed(2)}%)
//             </span>
//           </p>
//           <p className="m-0">
//             Bénéfice net (TTC - fee - TT) :{" "}
//             <span
//               className={netProfit < 0 ? "font-bold text-destructive-700" : ""}
//             >
//               {FormatTools.pedFormat().format(netProfit)} Ped (
//               {netPercent.toFixed(2)}%)
//             </span>
//           </p>
//         </>
//       }
//     />
//   );
// }

// export default function TransactionFormFields({
//   item,
//   action,
// }: TransactionFormFieldsProps) {
//   return action === "buy" ? (
//     <TransactionBuyFields item={item} />
//   ) : (
//     <TransactionSellFields item={item} />
//   );
// }
