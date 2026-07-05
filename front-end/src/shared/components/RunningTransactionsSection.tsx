import { useNavigate, createSearchParams } from "react-router-dom";
import { GenericList } from "@/shared/components";
import { createRunningTransactionsColumns } from "@/shared/components/GenericList/columnDefinition";
import { FormatTools } from "@/shared/tools/formatTools";
import { useUpdateRunningTransactionsStatus } from "../hooks";
import useRunningTransactions from "../hooks/useRunningTransactions";

function RunningTransactionsSection() {
  const navigate = useNavigate();
  const { rows, isLoading, isError } = useRunningTransactions();
  const updateStatusMutation = useUpdateRunningTransactionsStatus();
  const totalTtc = rows.reduce((sum, row) => sum + row.ttc, 0);

  const columns = createRunningTransactionsColumns({
    isRowPending: (row) =>
      updateStatusMutation.isPending &&
      row.transactionLotIds.some((id) =>
        updateStatusMutation.variables?.transactionLotIds?.includes(id),
      ),
    onStatusChange: (row, status) => {
      updateStatusMutation.mutate(
        {
          transactionLotIds: row.transactionLotIds,
          status,
        },
        {
          onSuccess: () => {
            navigate({
              pathname: `/home/${row.itemId}/sell`,
              search: createSearchParams({
                resellStatus: status,
                quantity: String(row.quantity),
                ttc: String(row.ttc),
              }).toString(),
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
        rowClassName="transition duration-150 ease-in-out hover:-translate-y-px hover:border-info/30 hover:bg-info/5 hover:shadow-md last:border-b"
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
