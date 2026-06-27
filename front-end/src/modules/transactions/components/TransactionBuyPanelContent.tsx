import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Section } from "@/shared/components/Containers";
import { GenericForm } from "@/shared/components/form/Genericform";
import { buyTransaction } from "../transaction.api";
import { createBuyFormSchema } from "../transactionSchemas";
import type { TransactionBuyFormValues, TransactionPanelProps } from "../types";
import TransactionBuyFormFields from "./TransactionBuyFormFields";

function TransactionBuyPanelContent({ item, onBack }: TransactionPanelProps) {
  const queryClient = useQueryClient();
  const buyFormSchema = useMemo(
    () => createBuyFormSchema(item.quantity),
    [item.quantity],
  );

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
    <Section variant="modal" className="p-2">
      <GenericForm
        key={item.itemId}
        schema={buyFormSchema}
        defaultValues={{
          autoCalculation: true,
          quantity: 1,
          fee: 0,
          buyPrice: item.unitPrice,
        }}
        className="space-y-2"
        onSubmit={onSubmitBuy}
      >
        <TransactionBuyFormFields item={item} />

        {buyMutation.isError ? (
          <p className="m-0 text-sm text-destructive-300">
            Impossible de valider l&apos;achat.
          </p>
        ) : null}

        <div className="flex justify-end gap-1">
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
