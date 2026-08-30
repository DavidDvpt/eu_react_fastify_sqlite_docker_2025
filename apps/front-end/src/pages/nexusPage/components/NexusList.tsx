import { GenericList } from "@/shared/components";
import { nexusColumns } from "@/shared/components/GenericList/columnDefinition";
import type { NexusUpdateDto } from "@eu/types";

type NexusListProps = {
  className?: string;
  rows: NexusUpdateDto[];
  isLoading: boolean;
  isError: boolean;
};

function NexusList({ className, rows, isLoading, isError }: NexusListProps) {
  return (
    <GenericList<NexusUpdateDto>
      columns={nexusColumns}
      rows={rows}
      getRowKey={(row) => row.id}
      hasHeader
      isLoading={isLoading}
      isError={isError}
      loadingMessage="Chargement des updates Nexus..."
      errorMessage="Impossible de charger les updates Nexus."
      emptyMessage="Aucune update Nexus."
      className={className}
      rowHeight={48}
    />
  );
}

export default NexusList;
