import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { GenericForm } from "@/components/form/Genericform";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/shared/components/Containers";
import { FormatTools } from "@/shared/tools";
import { buyTransaction } from "../../../lib/services/transactionApi";

import type { TransactionBuyFormValues, TransactionFilterRow } from "@/shared/types";

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

type TransactionBuyPanelContentProps = {
  item: TransactionFilterRow;
  onBack: () => void;
};

type TransactionBuyFormFieldsProps = {
  item: TransactionFilterRow;
};

function TransactionBuyFormFields({ item }: TransactionBuyFormFieldsProps) {
  const form = useFormContext<TransactionBuyFormValues>();
  const buyPriceField = form.register("buyPrice", { valueAsNumber: true });
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
  const minimumBuyPrice = useMemo(
    () => Math.ceil(unitReferenceTotal),
    [unitReferenceTotal],
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
        <div className="w-[30%] min-w-0 space-y-1">
          <label
            className="text-sm text-input-label"
            htmlFor="transaction-buy-quantity"
          >
            Quantite
          </label>
          <Input
            id="transaction-buy-quantity"
            type="number"
            min={1}
            step={1}
            onFocus={(event) => event.currentTarget.select()}
            {...form.register("quantity", { valueAsNumber: true })}
          />
          {form.formState.errors.quantity ? (
            <p className="m-0 text-[0.8rem] italic text-destructive-300">
              {form.formState.errors.quantity.message}
            </p>
          ) : null}
        </div>

        <div className="w-[30%] min-w-0 space-y-1">
          <label className="text-sm text-input-label" htmlFor="transaction-buy-fee">
            Fee (optionnel)
          </label>
          <Input
            id="transaction-buy-fee"
            type="number"
            min={0}
            step="0.01"
            onFocus={(event) => event.currentTarget.select()}
            {...form.register("fee", { valueAsNumber: true })}
          />
          {form.formState.errors.fee ? (
            <p className="m-0 text-[0.8rem] italic text-destructive-300">
              {form.formState.errors.fee.message}
            </p>
          ) : null}
        </div>

        <div className="w-[30%] min-w-0 space-y-1">
          <label className="text-sm text-input-label" htmlFor="transaction-buy-price">
            Achat
          </label>
          <Input
            id="transaction-buy-price"
            type="number"
            min={0.01}
            step="0.01"
            {...buyPriceField}
            onFocus={(event) => event.currentTarget.select()}
            onBlur={(event) => {
              buyPriceField.onBlur(event);
              const currentValue = Number(event.currentTarget.value);
              if (
                !Number.isFinite(currentValue) ||
                currentValue < minimumBuyPrice
              ) {
                form.setValue("buyPrice", minimumBuyPrice, {
                  shouldValidate: true,
                });
              }
            }}
          />
          {form.formState.errors.buyPrice ? (
            <p className="m-0 text-[0.8rem] italic text-destructive-300">
              {form.formState.errors.buyPrice.message}
            </p>
          ) : null}
        </div>
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

function TransactionBuyPanelContent({ item, onBack }: TransactionBuyPanelContentProps) {
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

  return (
    <Section className="space-y-4">
      <header>
        <h3 className="m-0 text-lg font-semibold text-card-inner-title">
          Achat
        </h3>
      </header>

      <GenericForm
        key={item.itemId}
        schema={buyFormSchema}
        defaultValues={{ quantity: 1, fee: 0, buyPrice: item.unitPrice }}
        className="space-y-4"
        onSubmit={(values) => buyMutation.mutate(values)}
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
            onClick={onBack}
            disabled={buyMutation.isPending}
          >
            Retour
          </Button>
          <Button
            type="submit"
            variant="primary"
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
