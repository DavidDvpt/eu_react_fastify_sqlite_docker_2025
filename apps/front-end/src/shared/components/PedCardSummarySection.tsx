import { GenericList } from "@/shared/components";
import useInventoryList from "@/pages/inventoryPage/inventory/useInventoryList";
import usePedCard from "@/shared/hooks/usePedcardData";
import useRunningTransactions from "@/shared/hooks/useRunningTransactions";
import FormatTools from "@/shared/tools/formatTools";
import { useMemo } from "react";
import {
  pedCardSummaryBodyClassName,
  pedCardSummaryColumn,
  pedCardSummaryFooterRowClassName,
  pedCardSummaryListClassName,
  pedCardSummaryRowBaseClassName,
  pedCardSummaryRowClassName,
  pedCardSummaryRowHeight,
} from "./GenericList/columnDefinition/pedCardSummaryColumns";
import type { PedCardSummaryRow } from "../types/pedcard";

function PedCardSummarySection() {
  const {
    pedCard,
    isLoading: isPedCardLoading,
    isError: isPedCardError,
  } = usePedCard();
  const {
    rows: runningRows,
    isLoading: isRunningTransactionsLoading,
    isError: isRunningTransactionsError,
  } = useRunningTransactions({ status: "RUNNING" });
  const {
    totalStockValue,
    isLoading: isInventoryLoading,
    isError: isInventoryError,
  } = useInventoryList();

  const totalRunningTransactionsTtc = useMemo(
    () => runningRows.reduce((sum, row) => sum + row.ttc, 0),
    [runningRows],
  );

  const rows = useMemo<PedCardSummaryRow[]>(
    () => [
      {
        key: "ped-card",
        label: "Montant de la ped card",
        amount: FormatTools.toSafeNumber(pedCard?.balance),
      },
      // {
      //   key: "stock-value",
      //   label: "Valeur totale du stock (TT)",
      //   amount: totalStockValue,
      // },
      {
        key: "running-sales",
        label: "Total des ventes en cours (TTC)",
        amount: totalRunningTransactionsTtc,
      },
    ],
    [pedCard?.balance, totalStockValue, totalRunningTransactionsTtc],
  );

  const isLoading =
    isPedCardLoading || isRunningTransactionsLoading || isInventoryLoading;
  const isError =
    isPedCardError || isRunningTransactionsError || isInventoryError;
  const total = rows.reduce((sum, row) => sum + row.amount, 0);

  return (
    <GenericList<PedCardSummaryRow>
      columns={pedCardSummaryColumn}
      rows={isLoading || isError ? [] : rows}
      getRowKey={(row) => row.key}
      hasHeader={false}
      grow={false}
      isLoading={isLoading}
      isError={isError}
      loadingMessage="Chargement du récapitulatif..."
      errorMessage="Erreur de chargement du récapitulatif."
      emptyMessage="Aucune donnée."
      className={pedCardSummaryListClassName}
      bodyClassName={pedCardSummaryBodyClassName}
      rowBaseClassName={pedCardSummaryRowBaseClassName}
      rowClassName={pedCardSummaryRowClassName}
      rowHeight={pedCardSummaryRowHeight}
      footerConfig={
        isLoading || isError
          ? undefined
          : {
              rowClassName: pedCardSummaryFooterRowClassName,
              cells: [
                {
                  key: "total-summary",
                  content: (
                    <span>
                      Total:{" "}
                      <strong className="font-semibold">
                        {FormatTools.pedFormat().format(total)}
                      </strong>{" "}
                      Peds
                    </span>
                  ),
                },
              ],
            }
      }
    />
  );
}

export default PedCardSummarySection;
