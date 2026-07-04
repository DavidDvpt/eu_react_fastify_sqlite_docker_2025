import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Section } from "@/shared/components/Containers";
import { GenericForm } from "@/shared/components/form/Genericform";

import useInventoryRefresh from "@/shared/hooks/useInventoryRefresh";
import type {
  AutoPricingFormValues,
  TransactionBody,
  TransactionPanelProps,
} from "@/shared/types/transactions";
import { transaction } from "@/lib/services/transaction.api";
import { transactionFormSchema } from "./transactionSchemas";
import { computeQuantityPricing } from "./transactionUtils";
import TransactionFormContent from "./TransactionFormContent";
import { PANEL_COPY } from "./constants";

function TransactionPanelContent({
  item,
  onBack,
  action,
  defaultValues,
}: TransactionPanelProps) {
  const schema = useMemo(
    () => transactionFormSchema(item.quantity, action),
    [action, item.quantity],
  );
  const refreshStock = useInventoryRefresh(item.itemId, onBack);

  const mutation = useMutation({
    mutationFn: async (values: AutoPricingFormValues) => {
      return transaction({
        type: action,
        lines: [
          {
            itemId: item.itemId,
            quantity: values.quantity,
            tt: values.quantity * item.unitPrice,
            fee: values.fee,
            ttc: values.ttc,
          },
        ],
      } satisfies TransactionBody);
    },
    onSuccess: refreshStock,
  });

  const onSubmit = (values: AutoPricingFormValues) => {
    const tt = values.quantity * item.unitPrice;
    if (action === "buy" && values.ttc < tt) {
      const shouldContinue = window.confirm(
        "Le prix d'achat est inférieur au TT. Confirmer l'achat dans cet état ?",
      );
      if (!shouldContinue) return;
    }

    mutation.mutate(values);
  };

  const initialValues = useMemo(() => {
    const mergedValues = {
      quantity: defaultValues?.quantity ?? 1,
      fee: defaultValues?.fee ?? 0,
      ttc: defaultValues?.ttc ?? item.unitPrice,
    };

    return {
      autoCalculation: true,
      action,
      ...computeQuantityPricing({
        action,
        quantity: mergedValues.quantity,
        fee: mergedValues.fee,
        ttc: mergedValues.ttc,
        unitPrice: item.unitPrice,
      }),
    };
  }, [
    action,
    defaultValues?.fee,
    defaultValues?.quantity,
    defaultValues?.ttc,
    item.unitPrice,
  ]);

  return (
    <Section variant="modal" className="p-2">
      <GenericForm
        key={`${action}-${item.itemId}-${item.unitPrice}-${initialValues.quantity}-${initialValues.ttc}`}
        schema={schema}
        defaultValues={initialValues}
        className="space-y-2"
        onSubmit={onSubmit}
      >
        <TransactionFormContent item={item} action={action} />

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
