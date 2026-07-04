import { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { GenericList } from "@/shared/components";
import { createRunningTransactionsColumns } from "@/shared/components/GenericList/columnDefinition";
import useRunningTransactions from "../useRunningTransactions";
import useUpdateRunningTransactionsStatus from "../useUpdateRunningTransactionsStatus";
import RunningTransactionResellConfirmModal from "./RunningTransactionResellConfirmModal";
import type { RunningTransaction } from "@/shared/types/transactions";

function RunningTransactionsSection() {
  const navigate = useNavigate();
  const [pendingResell, setPendingResell] = useState<{
    row: RunningTransaction;
    status: "SOLDED" | "RETURNED";
  } | null>(null);
  const [isResellConfirmOpen, setIsResellConfirmOpen] = useState(false);
  const { rows, isLoading, isError } = useRunningTransactions();
  const updateStatusMutation = useUpdateRunningTransactionsStatus();

  const columns = createRunningTransactionsColumns({
    isRowPending: (row) =>
      updateStatusMutation.isPending &&
      row.transactionLotIds.some((id) =>
        updateStatusMutation.variables?.transactionLotIds?.includes(id),
      ),
    onStatusChange: (row, status) => {
      setPendingResell({
        row,
        status,
      });
      setIsResellConfirmOpen(false);

      updateStatusMutation.mutate(
        {
          transactionLotIds: row.transactionLotIds,
          status,
        },
        {
          onSuccess: () => {
            setIsResellConfirmOpen(true);
          },
          onError: () => {
            setPendingResell(null);
          },
        },
      );
    },
  });

  const closeResellModal = () => {
    setPendingResell(null);
    setIsResellConfirmOpen(false);
  };

  const confirmResell = () => {
    console.log(pendingResell);
    if (!pendingResell) return;

    navigate({
      pathname: `/home/${pendingResell.row.itemId}/sell`,
      search: createSearchParams({
        quantity: String(pendingResell.row.quantity),
        ttc: String(pendingResell.row.ttc),
      }).toString(),
    });

    closeResellModal();
  };

  return (
    <>
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

      <RunningTransactionResellConfirmModal
        open={isResellConfirmOpen && Boolean(pendingResell)}
        row={pendingResell?.row ?? null}
        status={pendingResell?.status ?? null}
        onCancel={closeResellModal}
        onConfirm={confirmResell}
      />
    </>
  );
}

export default RunningTransactionsSection;
