import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { GenericForm } from "@/shared/components/form/Genericform";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import { Button } from "@/components/ui/button";
import { Section } from "@/shared/components/Containers";
import { FormatTools } from "@/shared/tools";
import { buyTransaction } from "../../../lib/services/transactionApi";
import type {
  TransactionBuyFormFieldsProps,
  TransactionBuyFormValues,
  TransactionPanelProps,
} from "../types";

const buyFormSchema = z.object({
  quantity: z.coerce
    .number()
    .int()
    .positive("La quantite doit etre superieure a 0."),
  fee: z.preprocess((value) => {
    if (value === "" || value === undefined || value === null) {
      return 0;
    }
    return value;
  }, z.coerce.number().nonnegative("Le fee doit etre positif ou nul.")),
  buyPrice: z.coerce
    .number()
    .positive("Le prix d'achat doit etre superieur a 0."),
});

function TransactionBuyFormFields({ item }: TransactionBuyFormFieldsProps) {
  const form = useFormContext<TransactionBuyFormValues>();
  const quantity = useWatch({ control: form.control, name: "quantity" });
  const fee = useWatch({ control: form.control, name: "fee" });
  const buyPrice = useWatch({ control: form.control, name: "buyPrice" });
  const quantityValue = Number.isFinite(quantity) ? quantity : 0;
  const feeValue = Number.isFinite(fee) ? fee : 0;
  const buyPriceValue = Number.isFinite(buyPrice) ? buyPrice : 0;

  const unitReferenceTotal = useMemo(
    () => quantityValue * item.unitPrice,
    [item.unitPrice, quantityValue],
  );
  const buyMarkupRatio = useMemo(
    () =>
      unitReferenceTotal > 0 ? (buyPriceValue / unitReferenceTotal) * 100 : 0,
    [buyPriceValue, unitReferenceTotal],
  );
  const markupCost = useMemo(
    () => buyPriceValue - feeValue - unitReferenceTotal,
    [buyPriceValue, feeValue, unitReferenceTotal],
  );

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <InputRHF
          name="quantity"
          type="number"
          min={1}
          step={1}
          registerOptions={{ valueAsNumber: true }}
          selectOnFocus
          label="Quantite"
          labelClassName="text-sm text-[var(--color-modal-text)]"
          wrapperClassName="w-[30%] min-w-0"
        />

        <InputRHF
          name="fee"
          type="number"
          min={0}
          step="0.01"
          registerOptions={{ valueAsNumber: true }}
          selectOnFocus
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
          label="Achat"
          labelClassName="text-sm text-[var(--color-modal-text)]"
          wrapperClassName="w-[30%] min-w-0"
        />
      </div>

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

function TransactionBuyPanelContent({ item, onBack }: TransactionPanelProps) {
  const queryClient = useQueryClient();

  const buyMutation = useMutation({
    mutationFn: async (values: TransactionBuyFormValues) =>
      buyTransaction({
        type: "buy",
        lines: [
          {
            itemId: item.itemId,
            quantity: values.quantity,
            tt: values.quantity * item.unitPrice,
            fee: values.fee,
            ttc: values.buyPrice,
          },
        ],
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["items-stock"] }),
        queryClient.invalidateQueries({
          queryKey: ["stock", "details", item.itemId],
        }),
      ]);
      onBack();
    },
  });

  const onSubmitBuy = (values: TransactionBuyFormValues) => {
    const tt = values.quantity * item.unitPrice;
    if (values.buyPrice < tt) {
      const shouldContinue = window.confirm(
        "Le prix d'achat est inférieur au TT. Confirmer l'achat dans cet état ?",
      );
      if (!shouldContinue) return;
    }

    buyMutation.mutate(values);
  };

  return (
    <Section variant="modal" className="space-y-4">
      <GenericForm
        key={item.itemId}
        schema={buyFormSchema}
        defaultValues={{ quantity: 1, fee: 0, buyPrice: item.unitPrice }}
        className="space-y-4"
        onSubmit={onSubmitBuy}
      >
        <TransactionBuyFormFields item={item} />

        {buyMutation.isError ? (
          <p className="m-0 text-sm text-destructive-300">
            Impossible de valider l&apos;achat.
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="min-w-[110px] text-black"
            onClick={onBack}
            disabled={buyMutation.isPending}
          >
            Retour
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="min-w-[110px]"
            disabled={buyMutation.isPending}
          >
            Acheter
          </Button>
        </div>
      </GenericForm>
    </Section>
  );
}

export default TransactionBuyPanelContent;
