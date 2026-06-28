import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { buyTransaction, sellTransaction } from "../transaction.api";
import { createBuyFormSchema, sellFormSchema } from "../transactionSchemas";
import type {
  BuyTransactionBody,
  SellTransactionBody,
  TransactionPanelProps,
} from "../types";
import TransactionFormFields from "./TransactionFormFields";
import TransactionPanelFormShell from "./TransactionPanelFormShell";

type TransactionBuyFormValues = {
  autoCalculation: boolean;
  quantity: number;
  fee: number;
  buyPrice: number;
};

type TransactionSellFormValues = {
  autoCalculation: boolean;
  quantity: number;
  fee: number;
  ttc: number;
};

const PANEL_COPY = {
  buy: {
    buttonGapClassName: "gap-1",
    errorMessage: "Impossible de valider l'achat.",
    submitLabel: "Acheter",
  },
  sell: {
    buttonGapClassName: "gap-2",
    errorMessage: "Impossible de valider la vente.",
    submitLabel: "Vendre",
  },
} as const;

function useStockRefresh(itemId: string, onBack: () => void) {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["items-stock"] }),
      queryClient.invalidateQueries({
        queryKey: ["stock", "details", itemId],
      }),
    ]);
    onBack();
  };
}

function TransactionBuyPanelContent({
  item,
  onBack,
}: Omit<TransactionPanelProps, "action">) {
  const schema = useMemo(() => createBuyFormSchema(item.quantity), [item.quantity]);
  const refreshStock = useStockRefresh(item.itemId, onBack);

  const buyMutation = useMutation({
    mutationFn: async (values: TransactionBuyFormValues) =>
      buyTransaction({
        type: "buy",
        lines: [
          {
            itemId: item.itemId,
            quantity: values.quantity,
            tt: values.quantity * item.unitPrice,
            fee: 0,
            ttc: values.buyPrice,
          },
        ],
      } satisfies BuyTransactionBody),
    onSuccess: refreshStock,
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
    <TransactionPanelFormShell
      formKey={`buy-${item.itemId}`}
      schema={schema}
      defaultValues={{
        autoCalculation: true,
        quantity: 1,
        fee: 0,
        buyPrice: item.unitPrice,
      }}
      onSubmit={onSubmitBuy}
      onBack={onBack}
      isPending={buyMutation.isPending}
      isError={buyMutation.isError}
      errorMessage={PANEL_COPY.buy.errorMessage}
      submitLabel={PANEL_COPY.buy.submitLabel}
      buttonGapClassName={PANEL_COPY.buy.buttonGapClassName}
    >
      <TransactionFormFields item={item} action="buy" />
    </TransactionPanelFormShell>
  );
}

function TransactionSellPanelContent({
  item,
  onBack,
}: Omit<TransactionPanelProps, "action">) {
  const schema = useMemo(() => sellFormSchema(item.quantity), [item.quantity]);
  const refreshStock = useStockRefresh(item.itemId, onBack);

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
      } satisfies SellTransactionBody),
    onSuccess: refreshStock,
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
    <TransactionPanelFormShell
      formKey={`sell-${item.itemId}`}
      schema={schema}
      defaultValues={{
        autoCalculation: true,
        quantity: 1,
        fee: 0,
        ttc: Math.ceil(item.unitPrice),
      }}
      onSubmit={onSubmitSell}
      onBack={onBack}
      isPending={sellMutation.isPending}
      isError={sellMutation.isError}
      errorMessage={PANEL_COPY.sell.errorMessage}
      submitLabel={PANEL_COPY.sell.submitLabel}
      buttonGapClassName={PANEL_COPY.sell.buttonGapClassName}
    >
      <TransactionFormFields item={item} action="sell" />
    </TransactionPanelFormShell>
  );
}

function TransactionPanelContent(props: TransactionPanelProps) {
  return props.action === "buy" ? (
    <TransactionBuyPanelContent item={props.item} onBack={props.onBack} />
  ) : (
    <TransactionSellPanelContent item={props.item} onBack={props.onBack} />
  );
}

export default TransactionPanelContent;
