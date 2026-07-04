import { Panel, Section } from "@/shared/components/Containers";
import { RunningSellsSection } from "@/modules/home";

function HomePage() {
  return (
    <Panel className="mx-0 grid h-full min-h-0 w-full grid-cols-12 gap-4 p-4">
      <Section className="col-span-6 flex min-h-0 flex-col overflow-hidden p-0" shadow={false}>
        <RunningSellsSection />
      </Section>

      <Section className="col-span-6 flex min-h-0 flex-col overflow-hidden p-0" shadow={false}>
        <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-muted-foreground">
          Section droite a definir
        </div>
      </Section>
    </Panel>
  );
}

export default HomePage;
