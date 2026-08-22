import { GenericList } from "@/shared/components";
import {
  inventoryFinancialReportBodyClassName,
  inventoryFinancialReportColumn,
  inventoryFinancialReportListClassName,
  inventoryFinancialReportRowBaseClassName,
  inventoryFinancialReportRowClassName,
  inventoryFinancialReportRowHeight,
  type InventoryFinancialReportRow,
} from "@/shared/components/GenericList/columnDefinition/inventoryFinancialReportColumns";
import {
  useFinancialInventoryData,
  useInventoryStockData,
} from "@/shared/hooks";
import { FormatTools } from "@/shared/tools";
import { NumberHelper } from "@eu/helpers";
import { useMemo } from "react";

function FinancialReportSection() {
  const {
    inventoryStockValue,
    isInventoryStockError,
    isInventoryStockLoading,
  } = useInventoryStockData();
  const { data, isError, isLoading } = useFinancialInventoryData();

  const values = useMemo(() => {
    if (!data || isInventoryStockError || isError) return;
    if (isInventoryStockLoading || isLoading) return;

    const { totalIn, totalOut } = data;
    const buy = totalIn.ttc - (totalIn.fee ?? 0);
    const sell = totalOut.ttc - (totalOut.fee ?? 0) + inventoryStockValue;
    const roundedBuy = NumberHelper.round(buy);
    const roundedSell = NumberHelper.round(sell);
    const profit = roundedSell - roundedBuy;

    return {
      buy: roundedBuy,
      sell: roundedSell,
      fee: (totalOut.fee ?? 0) + (totalOut.fee ?? 0),
      profit,
    };
  }, [
    inventoryStockValue,
    isInventoryStockError,
    isInventoryStockLoading,
    data,
    isError,
    isLoading,
  ]);

  const rows = useMemo<InventoryFinancialReportRow[]>(
    () => [
      {
        key: "buy",
        label: "Total achat",
        amount: values?.buy ?? 0,
      },
      {
        key: "fee",
        label: "Taxes",
        amount: values?.fee ?? 0,
      },
      {
        key: "sell",
        label: "Total Ventes",
        amount: values?.sell ?? 0,
      },
    ],
    [values],
  );
  return (
    <GenericList<InventoryFinancialReportRow>
      columns={inventoryFinancialReportColumn}
      rows={rows ?? []}
      getRowKey={(row) => row.key}
      hasHeader={false}
      grow={false}
      isLoading={isLoading || isInventoryStockLoading}
      isError={isError || isInventoryStockError}
      loadingMessage="Chargement du rapport financier..."
      errorMessage="Erreur de chargement du rapport financier."
      emptyMessage="Aucune donnée."
      className={inventoryFinancialReportListClassName}
      bodyClassName={inventoryFinancialReportBodyClassName}
      rowBaseClassName={inventoryFinancialReportRowBaseClassName}
      rowClassName={inventoryFinancialReportRowClassName}
      rowHeight={inventoryFinancialReportRowHeight}
      footerConfig={{
        rowClassName: "justify-end px-4 py-2 text-table-body-text",
        cells: [
          {
            key: "profit-summary",
            content: (
              <span>
                Profit global:{" "}
                <strong className="font-semibold">
                  {FormatTools.pedFormat().format(values?.profit ?? 0)}
                </strong>{" "}
                Peds
              </span>
            ),
          },
        ],
      }}
    />
  );
}

export default FinancialReportSection;
