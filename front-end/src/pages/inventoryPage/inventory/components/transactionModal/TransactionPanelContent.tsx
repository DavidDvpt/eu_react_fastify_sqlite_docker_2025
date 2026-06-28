import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Section } from "@/shared/components/Containers";
import { GenericForm } from "@/shared/components/form/Genericform";

import { createBuyFormSchema } from "./transactionSchemas";

import TransactionFormFields from "./TransactionFormFields";

import { PANEL_COPY } from "./constants";
import useInventoryRefresh from "@/shared/hooks/useInventoryRefresh";
import type {
  TransactionBody,
  TransactionFormValues,
  TransactionPanelProps,
} from "@/shared/types/transactions";
import { transaction } from "@/lib/services/transaction.api";

function TransactionPanelContent({
  item,
  onBack,
  action,
}: TransactionPanelProps) {
  const schema = useMemo(
    () => createBuyFormSchema(item.quantity),
    [item.quantity],
  );
  const refreshStock = useInventoryRefresh(item.itemId, onBack);

  const mutation = useMutation({
    mutationFn: async (values: TransactionFormValues) =>
      transaction({
        type: action,
        lines: [
          {
            itemId: item.itemId,
            quantity: values.quantity,
            tt: values.quantity * item.unitPrice,
            fee: 0,
            ttc: values.buyPrice,
          },
        ],
      } satisfies TransactionBody),
    onSuccess: refreshStock,
  });

  const onSubmitBuy = (values: TransactionFormValues) => {
    const tt = values.quantity * item.unitPrice;
    if (values.buyPrice < tt) {
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
        defaultValues={{
          autoCalculation: true,
          quantity: 1,
          fee: 0,
          buyPrice: item.unitPrice,
        }}
        className="space-y-2"
        onSubmit={onSubmitBuy}
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
