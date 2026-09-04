import { Button } from "@/components/ui/button";
import { Panel, Section } from "@/shared/components/Containers";
import { useNexusData, useNexusMutation, useQueryParams } from "@/shared/hooks";
import { NexusEditModal, NexusList } from "./components";
import { nexusRequestTypeSchema } from "@eu/zod-schemas";
import { useLocation, useNavigate } from "react-router-dom";

function NexusPage() {
  const { nexusRows, isNexusLoading, isNexusError } = useNexusData();
  const { initMutation, importMutation } = useNexusMutation();
  const { nexusUpdateId } = useQueryParams<{ nexusUpdateId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedNexus =
    nexusRows.find((row) => row.id === nexusUpdateId) ?? null;

  const handleCloseModal = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("nexusUpdateId");

    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const handleImport = (row: (typeof nexusRows)[number]) => {
    const result = nexusRequestTypeSchema.safeParse(row.nexusRequestType);

    if (result.success) importMutation.mutate({ type: result.data });
  };

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
        isImportPending={importMutation.isPending}
        onImport={handleImport}
      />
      {selectedNexus && (
        <NexusEditModal nexus={selectedNexus} open onClose={handleCloseModal} />
      )}
    </Panel>
  );
}

export default NexusPage;
