import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Section } from "@/shared/components/Containers";
import { GenericForm } from "@/shared/components/form/Genericform";
import { sellTransaction } from "../../../lib/services/transactionApi";
import { sellFormSchema } from "../transactionSchemas";
import type { TransactionPanelProps, TransactionSellFormValues } from "../types";
import TransactionSellFormFields from "./TransactionSellFormFields";

function TransactionSellPanelContent({ item, onBack }: TransactionPanelProps) {
  const queryClient = useQueryClient();
  const schema = sellFormSchema(item.quantity);

  const sellMutation = useMutation({
    mutationFn: async (values: TransactionSellFormValues) =>
      sellTransaction({
        type: "sell",
        lines: [
          {
            itemId: item.itemId,
            quantity: values.quantity,
            tt: values.quantity * item.unitPrice,
            ttc: values.ttc,
            fee: values.fee,
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

  const onSubmitSell = (values: TransactionSellFormValues) => {
    const tt = values.quantity * item.unitPrice;
    const gross = values.ttc - tt;
    const net = values.ttc - values.fee - tt;

    if (gross < 0 || net < 0) {
      const shouldContinue = window.confirm(
        "Cette vente génère un bénéfice négatif. Confirmer la vente dans cet état ?",
      );
      if (!shouldContinue) return;
    }

    sellMutation.mutate(values);
  };

  return (
    <Section variant="modal" className="space-y-4">
      <GenericForm
        key={item.itemId}
        schema={schema}
        defaultValues={{
          autoCalculation: true,
          quantity: 1,
          fee: 0,
          ttc: Math.ceil(item.unitPrice),
        }}
        className="space-y-4"
        onSubmit={onSubmitSell}
      >
        <TransactionSellFormFields item={item} />

        {sellMutation.isError ? (
          <p className="m-0 text-sm text-destructive-300">
            Impossible de valider la vente.
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="min-w-[110px] text-black"
            onClick={onBack}
            disabled={sellMutation.isPending}
          >
            Retour
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="min-w-[110px]"
            disabled={sellMutation.isPending}
          >
            Vendre
          </Button>
        </div>
      </GenericForm>
    </Section>
  );
}

export default TransactionSellPanelContent;
