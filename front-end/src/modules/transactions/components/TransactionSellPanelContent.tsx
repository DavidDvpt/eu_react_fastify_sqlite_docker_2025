import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { GenericForm } from "@/shared/components/form/Genericform";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/shared/components/Containers";
import { FormatTools } from "@/shared/tools";
import { sellTransaction } from "../../../lib/services/transactionApi";
import { feeCalculation } from "../helpers";

import type {
  TransactionPanelProps,
  TransactionSellFormValues,
} from "../types";

type TransactionSellFormFieldsProps = Pick<TransactionPanelProps, "item">;

function TransactionSellFormFields({ item }: TransactionSellFormFieldsProps) {
  const form = useFormContext<TransactionSellFormValues>();
  const quantity = useWatch({ control: form.control, name: "quantity" });
  const ttc = useWatch({ control: form.control, name: "ttc" });

  const quantityValue = Number.isFinite(quantity) ? quantity : 0;
  const costTt = useMemo(
    () => quantityValue * item.unitPrice,
    [item.unitPrice, quantityValue],
  );
  const ttcValue = Number.isFinite(ttc) ? ttc : 0;
  const feeValue = useMemo(
    () => feeCalculation(ttcValue - costTt),
    [costTt, ttcValue],
  );

  const grossProfit = ttcValue - costTt;
  const grossPercent = costTt > 0 ? (ttcValue / costTt) * 100 : 0;
  const netProfit = ttcValue - feeValue - costTt;
  const netPercent = costTt > 0 ? ((ttcValue - feeValue) / costTt) * 100 : 0;

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

        <div className="w-[30%] min-w-0 space-y-1">
          <label className="text-sm text-[var(--color-modal-text)]">Fee</label>
          <Input
            type="number"
            min={0}
            step="0.01"
            readOnly
            onFocus={(event) => event.currentTarget.select()}
            value={feeValue}
          />
        </div>

        <InputRHF
          name="ttc"
          type="number"
          min={0.01}
          step="0.01"
          registerOptions={{ valueAsNumber: true }}
          selectOnFocus
          label="TTC"
          labelClassName="text-sm text-[var(--color-modal-text)]"
          wrapperClassName="w-[30%] min-w-0"
        />
      </div>

      <div className="space-y-1 text-sm text-card-inner-title">
        <p className="m-0">
          Cout TT : {FormatTools.pedFormat().format(costTt)} Ped
        </p>
        <p className="m-0">
          Bénéfice brut (TTC - TT) :{" "}
          <span
            className={grossProfit < 0 ? "font-bold text-destructive-700" : ""}
          >
            {FormatTools.pedFormat().format(grossProfit)} Ped (
            {grossPercent.toFixed(2)}%)
          </span>
        </p>
        <p className="m-0">
          Bénéfice net (TTC - fee - TT) :{" "}
          <span
            className={netProfit < 0 ? "font-bold text-destructive-700" : ""}
          >
            {FormatTools.pedFormat().format(netProfit)} Ped (
            {netPercent.toFixed(2)}%)
          </span>
        </p>
      </div>
    </>
  );
}

function TransactionSellPanelContent({ item, onBack }: TransactionPanelProps) {
  const queryClient = useQueryClient();

  const sellFormSchema = useMemo(
    () =>
      z.object({
        quantity: z.coerce
          .number()
          .int()
          .positive("La quantite doit etre superieure a 0.")
          .max(
            item.quantity,
            `La quantite doit etre inferieure ou egale a ${item.quantity}.`,
          ),
        ttc: z.coerce.number().positive("Le TTC doit etre superieur a 0."),
      }),
    [item.quantity],
  );

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
            fee: feeCalculation(values.ttc - values.quantity * item.unitPrice),
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
    const fee = feeCalculation(gross);
    const net = values.ttc - fee - tt;

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
        schema={sellFormSchema}
        defaultValues={{ quantity: 1, ttc: Math.ceil(item.unitPrice) }}
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
