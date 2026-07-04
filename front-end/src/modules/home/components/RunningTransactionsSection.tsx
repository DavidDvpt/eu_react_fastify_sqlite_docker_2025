import { GenericList } from "@/shared/components";
import { createRunningTransactionsColumns } from "@/shared/components/GenericList/columnDefinition";
import useRunningTransactions from "../useRunningTransactions";
import useUpdateRunningTransactionsStatus from "../useUpdateRunningTransactionsStatus";

function RunningTransactionsSection() {
  const { rows, isLoading, isError } = useRunningTransactions();
  const updateStatusMutation = useUpdateRunningTransactionsStatus();

  const columns = createRunningTransactionsColumns({
    isRowPending: (row) =>
      updateStatusMutation.isPending &&
      row.transactionLotIds.some((id) =>
        updateStatusMutation.variables?.transactionLotIds?.includes(id),
      ),
    onStatusChange: (row, status) => {
      updateStatusMutation.mutate({
        transactionLotIds: row.transactionLotIds,
        status,
      });
    },
  });

  return (
    <GenericList
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.groupKey}
      viewMode="list"
      isLoading={isLoading}
      isError={isError}
      loadingMessage="Chargement des ventes en cours..."
      errorMessage="Erreur de chargement."
      emptyMessage="Aucune vente en cours."
      className="flex min-h-0 flex-1 flex-col rounded-md border border-table-border bg-table-bg text-sm shadow-ambient-md"
      headerClassName="border-table-border bg-table-head-bg text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
      bodyClassName="min-h-0 overflow-auto pr-1"
      rowClassName="transition duration-150 ease-in-out hover:-translate-y-px hover:border-info/30 hover:bg-info/5 hover:shadow-md last:border-b"
      rowHeight={56}
    />
  );
}

export default RunningTransactionsSection;
