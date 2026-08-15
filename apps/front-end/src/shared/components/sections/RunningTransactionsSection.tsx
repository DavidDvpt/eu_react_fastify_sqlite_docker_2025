import { GenericList } from "@/shared/components";
import { createRunningTransactionsColumns } from "@/shared/components/GenericList/columnDefinition";
import { FormatTools } from "@/shared/tools/formatTools";

import useTransactionsMutation from "@/shared/hooks/useTransactionsMutation";
import useRunningTransactions from "@/shared/hooks/useRunningTransactions";
import type { OpenTransactionModal } from "@/shared/types";

function RunningTransactionsSection() {
  const { rows, isLoading, isError } = useRunningTransactions({
    status: "RUNNING",
  });

  const openTransactionModal = ({ action, row }: OpenTransactionModal) => {
    const query = {
      action,
      itemId: row.item?.id,
      ttc: row.ttc,
      quantity: row.quantity,
      closePath: "/home",
    };

    const search = new URLSearchParams();
    search.set("transactionModal", JSON.stringify(query));

    return search;
  };

  const { mutateAsync: patchTransaction, isPending } = useTransactionsMutation({
    onStatusMutationSuccess: openTransactionModal,
  });
  const totalTtc = rows.reduce((sum, row) => sum + row.ttc, 0);

  const columns = createRunningTransactionsColumns({
    isRowPending: () => isPending,
    onChange: ({ row, value }) => {
      patchTransaction({
        row,
        status: value,
      });
    },
  });

  return (
    <>
      <GenericList
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
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
