import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Section } from "@/shared/components/Containers";
import { GenericForm } from "@/shared/components/form/Genericform";

import { createBuyFormSchema, sellFormSchema } from "./transactionSchemas";

import TransactionFormFields from "./TransactionFormFields";

import { PANEL_COPY } from "./constants";
import useInventoryRefresh from "@/shared/hooks/useInventoryRefresh";
import type {
  AutoPricingFormValues,
  TransactionBody,
  TransactionPanelProps,
} from "@/shared/types/transactions";
import { transaction } from "@/lib/services/transaction.api";

type TransactionPanelFormValues =
  | AutoPricingFormValues<"buyPrice">
  | AutoPricingFormValues<"ttc">;

function TransactionPanelContent({
  item,
  onBack,
  action,
}: TransactionPanelProps) {
  const schema = useMemo(
    () =>
      action === "buy"
        ? createBuyFormSchema(item.quantity)
        : sellFormSchema(item.quantity),
    [action, item.quantity],
  );
  const refreshStock = useInventoryRefresh(item.itemId, onBack);

  const mutation = useMutation({
    mutationFn: async (values: TransactionPanelFormValues) => {
      const ttc = action === "buy" ? values.buyPrice : values.ttc;

      return transaction({
        type: action,
        lines: [
          {
            itemId: item.itemId,
            quantity: values.quantity,
            tt: values.quantity * item.unitPrice,
            fee: values.fee,
            ttc,
          },
        ],
      } satisfies TransactionBody);
    },
    onSuccess: refreshStock,
  });

  const onSubmit = (values: TransactionPanelFormValues) => {
    const tt = values.quantity * item.unitPrice;
    if (action === "buy" && values.buyPrice < tt) {
      const shouldContinue = window.confirm(
        "Le prix d'achat est inférieur au TT. Confirmer l'achat dans cet état ?",
      );
      if (!shouldContinue) return;
    }

    mutation.mutate(values);
  };

  return (
    <Section variant="modal" className="p-2">
      <GenericForm
        key={`${action}-${item.itemId}`}
        schema={schema}
        defaultValues={
          action === "buy"
            ? {
                autoCalculation: true,
                quantity: 1,
                fee: 0,
                buyPrice: item.unitPrice,
              }
            : {
                autoCalculation: true,
                quantity: 1,
                fee: 0,
                ttc: item.unitPrice,
              }
        }
        className="space-y-2"
        onSubmit={onSubmit}
      >
        <TransactionFormFields item={item} action={action} />

        {mutation.isError ? (
          <p className="m-0 text-sm text-destructive-300">
            {PANEL_COPY[action].errorMessage}
          </p>
        ) : null}

        <div
          className={`flex justify-end ${PANEL_COPY[action].buttonGapClassName}`}
        >
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="min-w-[110px] text-black"
            onClick={onBack}
            disabled={mutation.isPending}
          >
            Retour
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="min-w-[110px]"
            disabled={mutation.isPending}
          >
            {PANEL_COPY[action].submitLabel}
          </Button>
        </div>
      </GenericForm>
    </Section>
  );
}

export default TransactionPanelContent;
