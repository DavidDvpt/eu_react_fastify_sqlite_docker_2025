import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import RunningTransactionsSection from "@/modules/home/components/RunningTransactionsSection";
import { Panel, Section } from "@/shared/components/Containers";
import TransactionModal from "@/shared/components/TransactionModal";
import { useTransaction } from "@/shared/hooks";
import type { TransactionModalProps } from "@/shared/types/transactions";

function HomePage() {
  const { id, action } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { transactionItem } = useTransaction({
    id,
    action,
  });

  const defaultValues = useMemo<TransactionModalProps["defaultValues"]>(() => {
    if (action !== "sell") {
      return undefined;
    }

    const quantity = Number(searchParams.get("quantity"));
    const ttc = Number(searchParams.get("ttc"));

    return {
      quantity:
        Number.isFinite(quantity) && quantity > 0 ? quantity : undefined,
      ttc: Number.isFinite(ttc) && ttc > 0 ? ttc : undefined,
    };
  }, [action, searchParams]);

  const isTransactionModalOpen = action === "sell" && Boolean(transactionItem);
  const handleCloseTransaction = () => {
    navigate("/home", { replace: true });
  };

  return (
    <Panel className="mx-0 grid h-full min-h-0 w-full grid-cols-12 gap-4 p-4">
      <Section
        className="col-span-6 flex min-h-0 flex-col overflow-hidden p-0"
        shadow={false}
      >
        <RunningTransactionsSection />
      </Section>

      <Section
        className="col-span-6 flex min-h-0 flex-col overflow-hidden p-0"
        shadow={false}
      >
        <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-muted-foreground">
          Section droite a definir
        </div>
      </Section>

      <TransactionModal
        isOpen={isTransactionModalOpen}
        action={action === "sell" ? "sell" : undefined}
        transactionItem={transactionItem}
        defaultValues={defaultValues}
        onClose={handleCloseTransaction}
      />
    </Panel>
  );
}

export default HomePage;
