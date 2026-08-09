import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Section } from "@/shared/components/Containers";
import { GenericForm } from "@/shared/components/form/Genericform";

import useInventoryRefresh from "@/shared/hooks/useInventoryRefresh";
import type {
  AutoPricingFormValues,
  TransactionPanelProps,
} from "@/shared/types/transactions";
import { transactionFormSchema } from "./transactionSchemas";
import { computeQuantityPricing } from "./transactionUtils";
import TransactionFormContent from "./TransactionFormContent";
import { PANEL_COPY } from "./constants";
import type {
  TransactionFormBody,
  TransactionStatusDto,
  TransactionTypeDto,
} from "@eu/types";
import TransactionsApi from "@/shared/services/transactionsApi";

function TransactionPanelContent({
  item,
  onBack,
  modalParams,
}: TransactionPanelProps) {
  const { action, quantity, ttc } = modalParams;
  const schema = useMemo(() => {
    return transactionFormSchema(item.quantity, modalParams.action!);
  }, [modalParams, item]);

  const refreshStock = useInventoryRefresh(item.id, onBack);

  const mutation = useMutation({
    mutationFn: async (
      values: AutoPricingFormValues & { status: TransactionStatusDto },
    ) => {
      const ts = new TransactionsApi();
      return ts.create({
        transactionType: (action === "sell"
          ? "SELL"
          : "BUY") as TransactionTypeDto,
        itemId: item.id,
        quantity: values.quantity,
        tt: values.quantity * item.value,
        fee: values.fee,
        ttc: values.ttc,
        status: values.status,
      } satisfies TransactionFormBody);
    },
    onSuccess: refreshStock,
  });

  const initialValues = useMemo(() => {
    const mergedValues = {
      quantity: quantity ?? 1,
      fee: 0,
      ttc: ttc ?? item.value,
    };

    return {
      autoCalculation: true,
      action,
      ...computeQuantityPricing({
        action,
        quantity: mergedValues.quantity,
        fee: mergedValues.fee,
        ttc: mergedValues.ttc,
        unitPrice: item.value,
      }),
    };
  }, [action, quantity, ttc, item.value]);

  if (!item) return null;

  const onSubmit = (values: AutoPricingFormValues) => {
    const tt = values.quantity * item.value;
    if (action === "buy" && values.ttc < tt) {
      const shouldContinue = window.confirm(
        "Le prix d'achat est inférieur au TT. Confirmer l'achat dans cet état ?",
      );
      if (!shouldContinue) return;
    }

    mutation.mutate({ ...values, status: "RUNNING" });
  };

  return (
    <Section variant="modal" className="p-2">
      <GenericForm
        key={`${action}-${item.id}-${item.value}-${initialValues.quantity}-${initialValues.ttc}`}
        schema={schema}
        defaultValues={initialValues}
        className="space-y-2"
        onSubmit={onSubmit}
      >
        <TransactionFormContent item={item} modalParams={modalParams} />

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
