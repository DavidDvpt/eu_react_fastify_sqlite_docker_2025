import { GenericList } from "@/shared/components";
import { createRunningTransactionsColumns } from "@/shared/components/GenericList/columnDefinition";
import { FormatTools } from "@/shared/tools/formatTools";
import {
  transactionStatusPatchDtoSchema,
  type TransactionDto,
} from "@eu/zod-schemas";

import { useNavigate } from "react-router-dom";
import { useTransactionsData, useTransactionMutation } from "@/shared/hooks";
import { Section } from "@/shared/components/Containers";

function RunningTransactionsSection({ className }: { className?: string }) {
  const navigate = useNavigate();
  const { running, isLoading, isError } = useTransactionsData();

  const { statusMutation } = useTransactionMutation();
  const totalTtc = running.reduce((sum, row) => sum + row.ttc, 0);

  const handleStatusChange = ({
    row,
    value,
  }: {
    row: TransactionDto;
    value: string;
  }) => {
    const result = transactionStatusPatchDtoSchema.safeParse(value);

    if (!result.success) return;

    statusMutation.mutate(
      {
        row,
        status: result.data,
      },
      {
        onSuccess(_data, { row }) {
          const query = {
            action: row.status === "SOLDED" ? "sell" : "resell",
            itemId: row.item?.id,
            ttc: row.ttc,
            quantity: row.quantity,
            closePath: "/home",
          };

          const search = new URLSearchParams();
          search.set("transactionModal", JSON.stringify(query));

          navigate({
            pathname: "/home",
            search: search.toString(),
          });
        },
      },
    );
  };

  const columns = createRunningTransactionsColumns({
    isRowPending: () => statusMutation.isPending,
    onChange: handleStatusChange,
  });

  return (
    <Section className={className}>
      <GenericList
        columns={columns}
        rows={running}
        getRowKey={(row) => row.id}
        hasHeader
        viewMode="list"
        grow={false}
        isLoading={isLoading}
        isError={isError}
        loadingMessage="Chargement des ventes en cours..."
        errorMessage="Erreur de chargement."
        emptyMessage="Aucune vente en cours."
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
    </Section>
  );
}

export default RunningTransactionsSection;
