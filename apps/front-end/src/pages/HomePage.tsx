import { Panel } from "@/shared/components/Containers";
import TransactionModal from "@/shared/components/TransactionModal";
import {
  FinancialSummarySection,
  RunningTransactionsSection,
} from "@/shared/components";
import FinancialReportSection from "@/shared/components/sections/FinancialReportSection";

function HomePage() {
  return (
    <Panel
      className="mx-0 grid h-full min-h-0 w-full grid-cols-12 gap-4 p-4"
    >
      <Panel className="col-span-6">
        <RunningTransactionsSection />
      </Panel>

      <Panel className="col-span-6">
        <Panel className="h-auto">
          <FinancialSummarySection />
        </Panel>
        <Panel className="h-auto">
          <FinancialReportSection />
        </Panel>
      </Panel>

      <TransactionModal />
    </Panel>
  );
}

export default HomePage;
