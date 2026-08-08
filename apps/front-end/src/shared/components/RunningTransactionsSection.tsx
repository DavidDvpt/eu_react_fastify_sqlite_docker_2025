import { useNavigate } from "react-router-dom";
import { GenericList } from "@/shared/components";
import { createRunningTransactionsColumns } from "@/shared/components/GenericList/columnDefinition";
import { FormatTools } from "@/shared/tools/formatTools";
import { useUpdateTransactionsStatus } from "../hooks";
import useRunningTransactions from "../hooks/useRunningTransactions";
import type { RunningTransaction, TransactionAction } from "../types";

function RunningTransactionsSection() {
  const navigate = useNavigate();
  const { rows, isLoading, isError } = useRunningTransactions();
  const updateStatusMutation = useUpdateTransactionsStatus();
  const totalTtc = rows.reduce((sum, row) => sum + row.ttc, 0);

  const openTransactionModal = (
    action: TransactionAction,
    row: RunningTransaction,
  ) => {
    const query = {
      action,
      itemId: row.item!.id,
      ttc: row.ttc,
      quantity: row.quantity,
      closePath: "/home",
    };

    const search = new URLSearchParams();
    search.set("transactionModal", JSON.stringify(query));

    return search;
  };

  const columns = createRunningTransactionsColumns({
    isRowPending: () => updateStatusMutation.isPending,
    onStatusChange: (row, status) => {
      updateStatusMutation.mutate(
        {
          id: row.id,
          status,
        },
        {
          onSuccess: () => {
            const isSell = status === "SOLDED";
            navigate({
              pathname: `/home/${row.item!.id}/sell`,
              search: openTransactionModal(
                isSell ? "newSell" : "resell",
                row,
              ).toString(),
            });
          },
        },
      );
    },
  });

  return (
    <>
      <GenericList
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.groupKey}
        hasHeader
        viewMode="list"
        grow={false}
        isLoading={isLoading}
        isError={isError}
        loadingMessage="Chargement des ventes en cours..."
        errorMessage="Erreur de chargement."
        emptyMessage="Aucune vente en cours."
        className="flex min-h-0 flex-col rounded-md border border-table-border bg-table-bg text-sm shadow-ambient-md m-2"
        headerClassName="bg-transparent min-h-0 "
        bodyClassName="min-h-0 overflow-auto pr-1"
        rowClassName="transition duration-150 ease-in-out  hover:bg-info/5  last:border-b"
        rowHeight={56}
        footerConfig={{
          rowClassName: "justify-end px-4 py-3 text-table-body-text",
          cells: [
            {
              key: "total-ttc",
              content: (
                <span>
                  Total:{" "}
                  <strong className="font-semibold">
                    {FormatTools.pedFormat().format(totalTtc)}
                  </strong>{" "}
                  Peds
                </span>
              ),
            },
          ],
        }}
      />
    </>
  );
}

export default RunningTransactionsSection;
