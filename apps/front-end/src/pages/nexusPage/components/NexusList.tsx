import { GenericList } from "@/shared/components";
import { nexusColumns } from "@/shared/components/GenericList/columnDefinition";
import { useNexusData } from "@/shared/hooks";
import type { NexusUpdateDto } from "@eu/types";

type NexusListProps = {
  className?: string;
};

function NexusList({ className }: NexusListProps) {
  const { nexusRows, isNexusLoading, isNexusError } = useNexusData();

  return (
    <GenericList<NexusUpdateDto>
      columns={nexusColumns}
      rows={nexusRows}
      getRowKey={(row) => row.id}
      hasHeader
      isLoading={isNexusLoading}
      isError={isNexusError}
      loadingMessage="Chargement des updates Nexus..."
      errorMessage="Impossible de charger les updates Nexus."
      emptyMessage="Aucune update Nexus."
      className={className}
      rowHeight={48}
    />
  );
}

export default NexusList;
