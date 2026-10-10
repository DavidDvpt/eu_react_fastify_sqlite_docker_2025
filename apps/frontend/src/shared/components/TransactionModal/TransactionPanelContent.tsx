import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Section } from "@/shared/components/Containers";
import { GenericForm } from "@/shared/components/form/Genericform";

import type {
  AutoPricingFormValues,
  TransactionModalParams,
  TransactionPricingField,
} from "@/shared/types/transactions";
import { transactionFormSchema } from "./transactionSchemas";
import { computeQuantityPricing } from "./transactionUtils";
import TransactionFormContent from "./TransactionFormContent";
import { PANEL_COPY } from "./constants";

import type { ItemWithStock } from "@/shared/types";
import useTransactionsMutation from "@/shared/hooks/useTransactionMutation";

function getTransactionErrorMessage(error: unknown, fallback: string) {
  const responseData = (error as { response?: { data?: unknown } })?.response
    ?.data;
  if (!responseData || typeof responseData !== "object") return fallback;

  const detail = (responseData as { detail?: unknown }).detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((entry) =>
        typeof entry === "object" && entry !== null && "msg" in entry
          ? String(entry.msg)
          : null,
      )
      .filter((message): message is string => Boolean(message));
    if (messages.length > 0) return messages.join(" ");
  }

  return fallback;
}

export type TransactionPanelProps = {
  item: ItemWithStock;
  onBack: () => void;
  modalParams: TransactionModalParams;
  defaultValues?: Partial<Pick<AutoPricingFormValues, TransactionPricingField>>;
};

function TransactionPanelContent({
  item,
  onBack,
  modalParams,
}: TransactionPanelProps) {
  const { action, quantity, ttc, lotId } = modalParams;
  // Selling MY single instance: exactly this lot, quantity locked to 1.
  const isInstanceSell =
    action === "sell" &&
    lotId != null &&
    item.type != null &&
    !item.type.isStackable;
  const schema = useMemo(() => {
    return transactionFormSchema(
      isInstanceSell ? 1 : item.stock,
      modalParams.action!,
    );
  }, [isInstanceSell, modalParams, item]);

  const { createMutation } = useTransactionsMutation();

  const initialValues = useMemo(() => {
    const mergedValues = {
      quantity: quantity ?? 1,
      fee: 0,
      ttc: ttc ?? item.value,
      ...(action === "buy" && item.type?.hasTierOption && !item.type.isStackable
        ? { tierLevel: 0 }
        : {}),
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
  }, [
    action,
    quantity,
    ttc,
    item.value,
    item.type,
  ]);

  if (!item) return null;

  const onSubmit = (values: AutoPricingFormValues) => {
    const tt = values.quantity * item.value;
    if (action === "buy" && values.ttc < tt) {
      const shouldContinue = window.confirm(
        "Le prix d'achat est inférieur au TT. Confirmer l'achat dans cet état ?",
      );
      if (!shouldContinue) return;
    }

    createMutation.mutate(
      {
        values: { ...values, status: "RUNNING" },
        item,
        action,
        lotId: isInstanceSell ? lotId : undefined,
      },
      {
        onSuccess: onBack,
      },
    );
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

        {createMutation.isError ? (
          <p className="m-0 text-sm text-destructive-300">
            {getTransactionErrorMessage(
              createMutation.error,
              PANEL_COPY[action].errorMessage,
            )}
          </p>
        ) : null}

        <div
          className={`flex justify-end ${PANEL_COPY[action].buttonGapClassName}`}
        >
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="min-w-[110px] text-text"
            onClick={onBack}
            disabled={createMutation.isPending}
          >
            Retour
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="min-w-[110px]"
            disabled={createMutation.isPending}
          >
            {PANEL_COPY[action].submitLabel}
          </Button>
        </div>
      </GenericForm>
    </Section>
  );
}

export default TransactionPanelContent;
