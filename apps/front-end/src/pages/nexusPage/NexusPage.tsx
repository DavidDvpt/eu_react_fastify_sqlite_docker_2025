import { Button } from "@/components/ui/button";
import { Panel, Section } from "@/shared/components/Containers";
import { useNexusData, useNexusMutation } from "@/shared/hooks";
import { NexusList } from "./components";

function NexusPage() {
  const { nexusRows, isNexusLoading, isNexusError } = useNexusData();
  const { initMutation } = useNexusMutation();

  return (
    <Panel className="min-h-0 gap-2">
      <Section className="flex items-start justify-end gap-2">
        <Button
          variant="primary"
          size="lg"
          className="w-[150px] cursor-pointer"
          disabled={nexusRows.length > 0 || initMutation.isPending}
          onClick={() => initMutation.mutate()}
        >
          Init
        </Button>
      </Section>
      <NexusList
        className="min-h-0"
        rows={nexusRows}
        isLoading={isNexusLoading}
        isError={isNexusError}
      />
    </Panel>
  );
}

export default NexusPage;
