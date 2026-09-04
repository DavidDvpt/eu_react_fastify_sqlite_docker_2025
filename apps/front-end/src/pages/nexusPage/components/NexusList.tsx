import { GenericList } from "@/shared/components";
import { createNexusColumns } from "@/shared/components/GenericList/columnDefinition";
import type { NexusUpdateDto } from "@eu/types";
import { useLocation, useNavigate } from "react-router-dom";

type NexusListProps = {
  className?: string;
  rows: NexusUpdateDto[];
  isLoading: boolean;
  isError: boolean;
  isImportPending: boolean;
  onImport: (row: NexusUpdateDto) => void;
};

function NexusList({
  className,
  rows,
  isLoading,
  isError,
  isImportPending,
  onImport,
}: NexusListProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const openNexusUpdate = (row: NexusUpdateDto) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("nexusUpdateId", row.id);

    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  return (
    <GenericList<NexusUpdateDto>
      columns={createNexusColumns({
        onCellClick: openNexusUpdate,
        onImport,
        isImportPending,
      })}
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
