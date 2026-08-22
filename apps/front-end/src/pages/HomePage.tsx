import { Panel, Section } from "@/shared/components/Containers";
import TransactionModal from "@/shared/components/TransactionModal";
import {
  FinancialSummarySection,
  RunningTransactionsSection,
} from "@/shared/components";
import FinancialReportSection from "@/shared/components/sections/FinancialReportSection";

function HomePage() {
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
        <FinancialSummarySection />
        <FinancialReportSection />
      </Section>

      <TransactionModal />
    </Panel>
  );
}

export default HomePage;
