import { GenericList } from "@/shared/components";

import FormatTools from "@/shared/tools/formatTools";
import { useMemo } from "react";

import { useTransactionsData } from "@/shared/hooks";
import {
  financialSummaryBodyClassName,
  financialSummaryColumn,
  financialSummaryRowBaseClassName,
  financialSummaryRowClassName,
  financialSummaryRowHeight,
} from "@/shared/components/GenericList/columnDefinition/financialSummaryColumns";
import { useInventoryStockData } from "@/shared/hooks";
import { Section } from "../Containers";

function FinancialSummarySection() {
  const { running: runningRows } = useTransactionsData();
  const { inventoryStockValue } = useInventoryStockData();

  const totalRunningTransactionsTtc = useMemo(
    () => runningRows.reduce((sum, row) => sum + row.ttc, 0),
    [runningRows],
  );

  const rows = useMemo(
    () => [
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
    [inventoryStockValue, totalRunningTransactionsTtc],
  );

  const total = rows.reduce((sum, row) => sum + row.amount, 0);

  return (
    <Section>
      <GenericList
        columns={financialSummaryColumn}
        rows={rows ?? []}
        getRowKey={(row) => row.key}
        hasHeader={false}
        grow={false}
        isLoading={undefined}
        isError={undefined}
        loadingMessage="Chargement du récapitulatif..."
        errorMessage="Erreur de chargement du récapitulatif."
        emptyMessage="Aucune donnée."
        bodyClassName={financialSummaryBodyClassName}
        rowBaseClassName={financialSummaryRowBaseClassName}
        rowClassName={financialSummaryRowClassName}
        rowHeight={financialSummaryRowHeight}
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
