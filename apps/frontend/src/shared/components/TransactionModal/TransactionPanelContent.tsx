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
import { canBuyMultipleLots } from "@/shared/helpers/transactionHelpers";
import TransactionFormContent from "./TransactionFormContent";
import { PANEL_COPY } from "./constants";

import type { ItemWithStock } from "@/shared/types";
import type { LotViewModel } from "@zod-schemas";
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
  lot?: LotViewModel | null;
  defaultValues?: Partial<Pick<AutoPricingFormValues, TransactionPricingField>>;
};

function TransactionPanelContent({
  item,
  onBack,
  modalParams,
  lot,
}: TransactionPanelProps) {
  const { action, quantity, ttc, lotId } = modalParams;
  // Selling MY single instance: exactly this lot, quantity locked to 1.
  const isNonStackable = item.type != null && !item.type.isStackable;
  const isInstanceSell = action === "sell" && isNonStackable;
  const schema = useMemo(() => {
    return transactionFormSchema(
      isInstanceSell ? 1 : item.stock,
      modalParams.action!,
      {
        isStackable: item.type?.isStackable,
        itemValue: item.value,
        allowBulk: canBuyMultipleLots(),
      },
    );
  }, [isInstanceSell, modalParams, item]);

  const { createMutation } = useTransactionsMutation();

  const initialValues = useMemo(() => {
    const mergedValues = {
      quantity: isNonStackable ? 1 : quantity ?? 1,
      tt: lot?.ttRemaining ?? item.value,
      fee: 0,
      ttc: ttc ?? item.value,
      lotCount: 1,
      ...(action === "buy" && item.type?.hasTierOption && !item.type.isStackable
        ? { tierLevel: 0 }
        : {}),
    };

    return {
      isAuction: true,
      action,
      ...(mergedValues.tierLevel !== undefined
        ? { tierLevel: mergedValues.tierLevel }
        : {}),
      ...mergedValues,
      ...computeQuantityPricing({
        action,
        quantity: isNonStackable ? 1 : mergedValues.quantity,
        fee: mergedValues.fee,
        ttc: mergedValues.ttc,
        unitPrice: item.value,
        isAuction: true,
      }),
    };
  }, [
    action,
    quantity,
    ttc,
    item.value,
    item.type,
    isNonStackable,
    lot?.ttRemaining,
  ]);

  if (!item) return null;

  const onSubmit = (values: AutoPricingFormValues) => {
    const tt = isNonStackable ? values.tt ?? item.value : values.quantity * item.value;
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
        key={`${action}-${item.id}-${item.value}-${initialValues.quantity}-${initialValues.ttc}-${initialValues.tt}`}
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
