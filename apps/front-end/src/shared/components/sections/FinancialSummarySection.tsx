import { GenericList } from "@/shared/components";

import FormatTools from "@/shared/tools/formatTools";
import { useMemo } from "react";

import type { PedCardSummaryRow } from "@/shared/types/pedcard";
import { usePedcardData, useTransactionsData } from "@/shared/hooks";
import {
  pedCardSummaryBodyClassName,
  pedCardSummaryColumn,
  pedCardSummaryRowBaseClassName,
  pedCardSummaryRowClassName,
  pedCardSummaryRowHeight,
} from "@/shared/components/GenericList/columnDefinition/pedCardSummaryColumns";
import { useInventoryStockData } from "@/shared/hooks";
import { Section } from "../Containers";

function FinancialSummarySection() {
  const { balance } = usePedcardData();
  const { running: runningRows } = useTransactionsData();
  const { inventoryStockValue } = useInventoryStockData();

  const totalRunningTransactionsTtc = useMemo(
    () => runningRows.reduce((sum, row) => sum + row.ttc, 0),
    [runningRows],
  );

  const rows = useMemo<PedCardSummaryRow[]>(
    () => [
      {
        key: "ped-card",
        label: "Montant de la ped card",
        amount: FormatTools.toSafeNumber(balance),
      },
      {
        key: "stock-value",
        label: "Valeur totale du stock (TT)",
        amount: inventoryStockValue,
      },
      {
        key: "running-sales",
        label: "Total des ventes en cours (TTC)",
        amount: totalRunningTransactionsTtc,
      },
    ],
    [balance, inventoryStockValue, totalRunningTransactionsTtc],
  );

  const total = rows.reduce((sum, row) => sum + row.amount, 0);

  return (
    <Section>
      <GenericList<PedCardSummaryRow>
        columns={pedCardSummaryColumn}
        rows={rows ?? []}
        getRowKey={(row) => row.key}
        hasHeader={false}
        grow={false}
        isLoading={undefined}
        isError={undefined}
        loadingMessage="Chargement du récapitulatif..."
        errorMessage="Erreur de chargement du récapitulatif."
        emptyMessage="Aucune donnée."
        bodyClassName={pedCardSummaryBodyClassName}
        rowBaseClassName={pedCardSummaryRowBaseClassName}
        rowClassName={pedCardSummaryRowClassName}
        rowHeight={pedCardSummaryRowHeight}
        footerConfig={{
          rowClassName: "justify-end py-2 text-table-body-text",
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
        }}
      />
    </Section>
  );
}

export default FinancialSummarySection;
