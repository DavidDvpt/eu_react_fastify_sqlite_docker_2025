import { Panel, Section } from "@/shared/components/Containers";
import { RunningSellsSection } from "@/modules/home";

function HomePage() {
  return (
    <Panel className="mx-auto flex h-full min-h-0 w-full p-4">
      <div className="grid h-full min-h-0 w-full grid-cols-12 gap-4">
        <Panel className="col-span-6 flex min-h-0 flex-col">
          <RunningSellsSection />
        </Panel>

        <Panel className="col-span-6 flex min-h-0 flex-col">
          <Section className="flex min-h-0 flex-1 items-center justify-center text-sm text-muted-foreground">
            Section droite a definir
          </Section>
        </Panel>
      </div>
    </Panel>
  );
}

export default HomePage;
