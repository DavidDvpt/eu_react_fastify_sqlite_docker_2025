import { Panel } from "@/shared/components/Containers";
import TransactionModal from "@/shared/components/TransactionModal";
import {
  FinancialSummarySection,
  RunningTransactionsSection,
} from "@/shared/components";
import FinancialReportSection from "@/shared/components/sections/FinancialReportSection";

function HomePage() {
  return (
    <Panel className="mx-0 grid h-full min-h-0 w-full grid-cols-12 gap-0 p-4">
      <Panel className="col-span-6">
        <RunningTransactionsSection />
      </Panel>

      <Panel className="col-span-6 flex flex-col space-y-4">
        <FinancialSummarySection />
        <FinancialReportSection />
      </Panel>

      <TransactionModal />
    </Panel>
  );
}

export default HomePage;
