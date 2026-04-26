import { useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { GenericForm } from "@/components/form/Genericform";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/shared/components/Containers";
import { FormatTools } from "@/shared/tools";
import { sellTrade } from "../services/tradeApi";

import type { TradeFilterRow, TradeSellFormValues } from "@/shared/types";

type TradeSellPanelContentProps = {
  item: TradeFilterRow;
  onBack: () => void;
};

type TradeSellFormFieldsProps = {
  item: TradeFilterRow;
};

/**
 * Fee auction calculation from extra auction value
 * @param markup extra auction value (TTC - TT)
 * @returns fee value with 2 digits after comma
 */
function feeCalculation(markup: number) {
  if (markup <= 0) return 0.5;

  const value = (99.5 * markup + 995) / (markup + 1990);

  if (value >= 100) return 100;
  return Math.floor(value * 100) / 100;
}

function calculateMinimumTtc(tt: number): number {
  let candidate = Math.ceil(tt);
  let guard = 0;

  while (guard < 100_000) {
    const markup = candidate - tt;
    const fee = feeCalculation(markup);
    const minimumFromFee = Math.ceil(tt + fee);

    if (candidate < minimumFromFee) {
      candidate = minimumFromFee;
      guard += 1;
      continue;
    }

    if (candidate - fee - tt >= 0) {
      return candidate;
    }

    candidate += 1;
    guard += 1;
  }

  return Math.ceil(tt);
}

function TradeSellFormFields({ item }: TradeSellFormFieldsProps) {
  const form = useFormContext<TradeSellFormValues>();
  const quantity = useWatch({ control: form.control, name: "quantity" });
  const ttc = useWatch({ control: form.control, name: "ttc" });
  const quantityField = form.register("quantity", { valueAsNumber: true });
  const ttcField = form.register("ttc", { valueAsNumber: true });

  const quantityValue = Number.isFinite(quantity) ? quantity : 0;
  const costTt = useMemo(
    () => quantityValue * item.unitPrice,
    [item.unitPrice, quantityValue],
  );
  const minimumTtc = useMemo(() => calculateMinimumTtc(costTt), [costTt]);

  const ttcValue = Number.isFinite(ttc) ? ttc : 0;
  const feeValue = useMemo(
    () => feeCalculation(ttcValue - costTt),
    [costTt, ttcValue],
  );

  useEffect(() => {
    const currentTtc = form.getValues("ttc");
    if (!Number.isFinite(currentTtc) || currentTtc < minimumTtc) {
      form.setValue("ttc", minimumTtc, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [form, minimumTtc]);

  const grossProfit = ttcValue - costTt;
  const grossPercent = costTt > 0 ? (ttcValue / costTt) * 100 : 0;
  const netProfit = ttcValue - feeValue - costTt;
  const netPercent = costTt > 0 ? ((ttcValue - feeValue) / costTt) * 100 : 0;

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="w-[30%] min-w-0 space-y-1">
          <label
            className="text-sm text-input-label"
            htmlFor="trade-sell-quantity"
          >
            Quantite
          </label>
          <Input
            id="trade-sell-quantity"
            type="number"
            min={1}
            step={1}
            onFocus={(event) => event.currentTarget.select()}
            {...quantityField}
          />
          {form.formState.errors.quantity ? (
            <p className="m-0 text-[0.8rem] italic text-destructive-300">
              {form.formState.errors.quantity.message}
            </p>
          ) : null}
        </div>

        <div className="w-[30%] min-w-0 space-y-1">
          <label className="text-sm text-input-label" htmlFor="trade-sell-fee">
            Fee
          </label>
          <Input
            id="trade-sell-fee"
            type="number"
            min={0}
            step="0.01"
            readOnly
            onFocus={(event) => event.currentTarget.select()}
            value={feeValue}
          />
        </div>

        <div className="w-[30%] min-w-0 space-y-1">
          <label className="text-sm text-input-label" htmlFor="trade-sell-ttc">
            TTC
          </label>
          <Input
            id="trade-sell-ttc"
            type="number"
            min={minimumTtc}
            step="0.01"
            {...ttcField}
            onFocus={(event) => event.currentTarget.select()}
            onBlur={(event) => {
              ttcField.onBlur(event);
              const currentValue = Number(event.currentTarget.value);
              if (!Number.isFinite(currentValue) || currentValue < minimumTtc) {
                form.setValue("ttc", minimumTtc, { shouldValidate: true });
              }
            }}
          />
          {form.formState.errors.ttc ? (
            <p className="m-0 text-[0.8rem] italic text-destructive-300">
              {form.formState.errors.ttc.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1 text-sm text-card-inner-title">
        <p className="m-0">
          Cout TT : {FormatTools.pedFormat().format(costTt)} PED
        </p>
        <p className="m-0">
          Benefice brut (TTC - TT) :{" "}
          {FormatTools.pedFormat().format(grossProfit)} PED (
          {grossPercent.toFixed(2)}%)
        </p>
        <p className={`m-0 ${netProfit < 0 ? "font-bold text-danger" : ""}`}>
          Benefice net (TTC - fee - TT) :{" "}
          {FormatTools.pedFormat().format(netProfit)} PED (
          {netPercent.toFixed(2)}%)
        </p>
      </div>
    </>
  );
}

function TradeSellPanelContent({ item, onBack }: TradeSellPanelContentProps) {
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
    mutationFn: async (values: TradeSellFormValues) =>
      sellTrade({
        lines: [
          {
            itemId: item.itemId,
            quantity: values.quantity,
            tt: values.quantity * item.unitPrice,
            ttc: values.ttc,
          },
        ],
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["stock"] }),
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
          Vente
        </h3>
      </header>

      <GenericForm
        key={item.itemId}
        schema={sellFormSchema}
        defaultValues={{ quantity: 1, ttc: Math.ceil(item.unitPrice) }}
        className="space-y-4"
        onSubmit={(values) => sellMutation.mutate(values)}
      >
        <TradeSellFormFields item={item} />

        {sellMutation.isError ? (
          <p className="m-0 text-sm text-destructive-300">
            Impossible de valider la vente.
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            disabled={sellMutation.isPending}
          >
            Retour
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={sellMutation.isPending}
          >
            Vendre
          </Button>
        </div>
      </GenericForm>
    </Section>
  );
}

export default TradeSellPanelContent;
